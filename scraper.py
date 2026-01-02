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
            'data': {}
        }
        
        # Look through all tables to find the one with course sections
        for table in tables:
            rows = table.find_all('tr')
            
            for row in rows:
                cells = row.find_all(['td', 'th'])
                
                # Convert cells to text and check if this row contains our section
                cell_texts = [cell.get_text(strip=True) for cell in cells]
                
                # Check if TST 201 (or the specified section) is in this row
                if any(section_code in text for text in cell_texts):
                    result['found'] = True
                    
                    # Extract all cell data
                    # Typical columns: Class, Comp Sec, Camp Loc, Assoc Class, Rel 1, Rel 2, Enrl Cap, Enrl Tot, Wait Cap, Wait Tot, Time, Days, Date, Bldg, Room, Instructor
                    
                    if len(cell_texts) >= 13:  # Make sure we have enough columns
                        result['data'] = {
                            'class': cell_texts[0] if len(cell_texts) > 0 else None,
                            'comp_sec': cell_texts[1] if len(cell_texts) > 1 else None,
                            'camp_loc': cell_texts[2] if len(cell_texts) > 2 else None,
                            'enrl_cap': cell_texts[3] if len(cell_texts) > 3 else None,
                            'enrl_tot': cell_texts[4] if len(cell_texts) > 4 else None,
                            'wait_cap': cell_texts[5] if len(cell_texts) > 5 else None,
                            'wait_tot': cell_texts[6] if len(cell_texts) > 6 else None,
                            'time': cell_texts[7] if len(cell_texts) > 7 else None,
                            'days': cell_texts[8] if len(cell_texts) > 8 else None,
                            'date': cell_texts[9] if len(cell_texts) > 9 else None,  # This should be 02/09-02/09
                            'building': cell_texts[10] if len(cell_texts) > 10 else None,
                            'room': cell_texts[11] if len(cell_texts) > 11 else None,
                            'instructor': cell_texts[12] if len(cell_texts) > 12 else None,
                        }
                    else:
                        # If structure is different, just store all cells
                        result['data'] = {
                            'raw_cells': cell_texts
                        }
                    
                    break
            
            if result['found']:
                break
        
        return {'success': True, 'data': result}
        
    except requests.exceptions.RequestException as e:
        return {'success': False, 'error': str(e)}
