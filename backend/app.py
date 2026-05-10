import os
import json
import requests
from bs4 import BeautifulSoup
from flask import Flask, request, jsonify
from flask_cors import CORS
from googlesearch import search
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini
api_key = os.environ.get("GEMINI_API_KEY")
genai.configure(api_key=api_key)

app = Flask(__name__)
CORS(app)

def extract_content_from_url(url):
    """Web Scraper / Content Extractor: Fetches URL and returns cleaned text."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        # Fetch the URL
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove noisy elements
        for script in soup(["script", "style", "nav", "footer", "header", "aside"]):
            script.extract()
            
        # Get cleaned text
        text = soup.get_text(separator=' ', strip=True)
        
        # Limit text length to avoid token limits (e.g., first 1000 words)
        words = text.split()[:1000]
        cleaned_text = ' '.join(words)
        return cleaned_text
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return ""

def get_wikipedia_image(query):
    """Fetches a relevant image from Wikipedia using a search generator."""
    try:
        headers = {
            'User-Agent': 'WanderBot/1.0 (contact@example.com)'
        }
        # Use generator=search to find the most relevant page even if the title isn't an exact match
        url = f"https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch={query}&gsrlimit=1&prop=pageimages&format=json&pithumbsize=600"
        response = requests.get(url, headers=headers, timeout=5)
        data = response.json()
        pages = data.get('query', {}).get('pages', {})
        for page_id, page_data in pages.items():
            if 'thumbnail' in page_data:
                return page_data['thumbnail']['source']
    except Exception as e:
        print(f"Wiki image error for {query}: {e}")
    # Fallback default travel image
    return "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_query = data.get('message', '')
    
    print(f"\n--- Processing Flow ---")
    print(f"1. User Query: {user_query}")
    
    search_query = f"top travel destinations {user_query} 2024"
    context = ""
    first_link = "#"
    
    try:
        # 2. Search API -> Top URLs
        top_urls = []
        try:
            # We fetch top 2 URLs
            print(f"2. Search API: Searching Google for '{search_query}'")
            for result in search(search_query, num_results=2):
                top_urls.append(result)
            print(f"   Top URLs found: {top_urls}")
        except Exception as e:
            print(f"   Google search error: {e}")
            
        if top_urls:
            first_link = top_urls[0]
            
        # 3 & 4. Web Scraper / Content Extractor -> Cleaned Text
        for url in top_urls:
            print(f"3. Web Scraper: Extracting content from {url}")
            cleaned_text = extract_content_from_url(url)
            if cleaned_text:
                print(f"4. Cleaned Text: Extracted {len(cleaned_text.split())} words.")
                context += f"Source ({url}):\n{cleaned_text}\n\n"
        
        if not context.strip():
            context = "No live web results available. Please use your internal knowledge."

        # 5. LLM Prompt
        print("5. LLM Prompt: Sending extracted context to Gemini.")
        generation_config = {
            "temperature": 0.7,
            "response_mime_type": "application/json",
        }
        
        system_prompt = (
            "You are an expert AI travel assistant. Using the provided real-time scraped web context, "
            "answer the user's travel request naturally and comprehensively. "
            "Output valid JSON ONLY with the following exact keys:\n"
            "- \"reply_text\": Your conversational response answering the query. Use basic HTML tags (<br>, <b>, <ul><li>) for formatting. If the user asks about costs, tips, or packing, answer fully here.\n"
            "- \"destinations\": An array of destination objects.\n"
            "   IMPORTANT: ONLY populate this array if the user explicitly mentions 'destinations', 'where to go', or asks for recommendations for specific places. \n"
            "   If the user asks about costs, flights, or general advice, keep this array EMPTY. Each object must have:\n"
            "   - \"title\": Destination name (e.g., 'Santorini, Greece')\n"
            "   - \"desc\": A short 1-2 sentence description.\n"
            "   - \"activities\": Comma-separated list of top activities.\n"
            "   - \"link\": Related URL from the context or '#' if none."
        )
        
        prompt = f"User Query: {user_query}\n\nExtracted Web Content:\n{context}"
        
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            generation_config=generation_config,
            system_instruction=system_prompt
        )
        
        # 6. Chatbot Response Generation
        response = model.generate_content(prompt)
        ai_data = json.loads(response.text)
        print("6. Chatbot Response: Gemini generated JSON successfully.")
        
        reply_text = ai_data.get('reply_text', 'Here is what I found for you:')
        destinations = ai_data.get('destinations', [])
        
        # Add images to each destination
        for dest in destinations:
            wiki_title = dest.get('title', '').split(',')[0].strip()
            dest['img'] = get_wikipedia_image(wiki_title)
            
        return jsonify({
            'reply_text': reply_text,
            'destinations': destinations
        })
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'reply_text': f"<b>System Error:</b> Our AI is experiencing some turbulence. <br><br><i>{str(e)}</i><br><br>Please make sure you are using the correct model name and try again.",
            'destinations': []
        }), 500

if __name__ == '__main__':
    print("Starting production-friendly flow backend on port 5000...")
    app.run(port=5000, debug=True)
