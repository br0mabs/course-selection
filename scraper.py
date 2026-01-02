import requests
from bs4 import BeautifulSoup

def scrape_url(url, section_code='TST 201'):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'lxml')
        
        # Find all tables on the page
        tables = soup.find_all('table')
        
        result = {
            'section': section_code,
            'found': False,
            'date': None
        }
        # Look through all tables to find the one with course sections
        for table in tables:
            rows = table.find_all('tr')
            
            for row in rows:
                cells = row.find_all(['td', 'th'])
                
                # Skip if no cells
                if not cells:
                    continue
                
                # Get the first cell text (the section identifier)
                first_cell = cells[1].get_text(strip=True)
                print(first_cell)
                # Check if this row starts with our section code (exact match in first column)
                if first_cell == section_code:
                    result['found'] = True
                    
                    # Convert all cells to text
                    cell_texts = [cell.get_text(strip=True) for cell in cells]
                    
                    # Extract only Time, Days, Date
                    # Adjust these indices based on the actual table structure
                    if len(cell_texts) >= 10:
                        result['date'] = cell_texts[10]
                    
                    # Found our row, stop searching
                    return {'success': True, 'data': result}
        
        # If we get here, the section wasn't found
        return {'success': True, 'data': result}
        
    except requests.exceptions.RequestException as e:
        return {'success': False, 'error': str(e)}