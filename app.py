#!/usr/bin/env python3
"""
World Travel Dataset & Analytics Dashboard - Pure Python Implementation
========================================================================
This single-file Python application implements the complete World Travel Dataset
analytics dashboard, global map, 942-row data catalog, destination deep-dive,
and trip budget calculator using standard Python 3 (no external dependencies required).

Usage:
    python3 app.py [PORT]
    (Default port: 8000, or set via PORT environment variable)
"""

import os
import sys
import csv
import json
import math
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from collections import defaultdict

CSV_PATH = os.path.join(os.path.dirname(__file__), 'public', 'assets', 'aistudio', 'world_travel_dataset_e8459e94.csv')

# Load and parse dataset
def load_dataset():
    records = []
    if not os.path.exists(CSV_PATH):
        # Fallback to local search
        alt_path = 'world_travel_dataset_e8459e94.csv'
        path_to_use = alt_path if os.path.exists(alt_path) else CSV_PATH
    else:
        path_to_use = CSV_PATH

    with open(path_to_use, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            records.append({
                'destination': row['Destination'],
                'country': row['Country'],
                'continent': row['Continent'],
                'latitude': float(row['Latitude']),
                'longitude': float(row['Longitude']),
                'tripType': row['Trip_Type'],
                'mainInterest': row['Main_Interest'],
                'bestSeason': row['Best_Season'],
                'recommendedDays': int(row['Recommended_Days']),
                'estimatedDailyBudgetUSD': float(row['Estimated_Daily_Budget_USD']),
                'estimatedTripBudgetUSD': float(row['Estimated_Trip_Budget_USD']),
                'averageTravelerRating': float(row['Average_Traveler_Rating']),
                'typicalTransport': row['Typical_Transport'],
                'estimatedHotelPerNightUSD': float(row['Estimated_Hotel_Per_Night_USD']),
                'estimatedFoodPerDayUSD': float(row['Estimated_Food_Per_Day_USD']),
                'estimatedLocalTransportPerDayUSD': float(row['Estimated_Local_Transport_Per_Day_USD']),
                'travelProfileId': row['Travel_Profile_ID']
            })
    return records

DATASET = load_dataset()

def compute_overall_stats(data):
    if not data:
        return {}
    total = len(data)
    destinations = set(d['destination'] for d in data)
    countries = set(d['country'] for d in data)
    daily_budgets = [d['estimatedDailyBudgetUSD'] for d in data]
    trip_budgets = [d['estimatedTripBudgetUSD'] for d in data]
    ratings = [d['averageTravelerRating'] for d in data]
    days = [d['recommendedDays'] for d in data]
    hotels = [d['estimatedHotelPerNightUSD'] for d in data]
    foods = [d['estimatedFoodPerDayUSD'] for d in data]
    transports = [d['estimatedLocalTransportPerDayUSD'] for d in data]

    return {
        'totalRecords': total,
        'uniqueDestinations': len(destinations),
        'uniqueCountries': len(countries),
        'avgDailyBudget': round(sum(daily_budgets) / total),
        'avgTripBudget': round(sum(trip_budgets) / total),
        'avgRating': round(sum(ratings) / total, 2),
        'avgDays': round(sum(days) / total, 1),
        'minDailyBudget': min(daily_budgets),
        'maxDailyBudget': max(daily_budgets),
        'avgHotelNight': round(sum(hotels) / total),
        'avgFoodDay': round(sum(foods) / total),
        'avgTransportDay': round(sum(transports) / total)
    }

def compute_continent_stats(data):
    groups = defaultdict(list)
    for d in data:
        groups[d['continent']].append(d)

    result = []
    for continent, items in groups.items():
        s = compute_overall_stats(items)
        result.append({
            'continent': continent,
            'count': len(items),
            'destinations': s['uniqueDestinations'],
            'avgDailyBudget': s['avgDailyBudget'],
            'avgTripBudget': s['avgTripBudget'],
            'avgRating': s['avgRating'],
            'avgHotel': s['avgHotelNight'],
            'avgFood': s['avgFoodDay'],
            'avgTransport': s['avgTransportDay']
        })
    result.sort(key=lambda x: x['avgDailyBudget'], reverse=True)
    return result

def compute_trip_type_stats(data):
    groups = defaultdict(list)
    for d in data:
        groups[d['tripType']].append(d)

    result = []
    for trip_type, items in groups.items():
        s = compute_overall_stats(items)
        result.append({
            'tripType': trip_type,
            'count': len(items),
            'avgDailyBudget': s['avgDailyBudget'],
            'avgTripBudget': s['avgTripBudget'],
            'avgRating': s['avgRating'],
            'avgDays': s['avgDays'],
            'avgHotel': s['avgHotelNight'],
            'avgFood': s['avgFoodDay'],
            'avgTransport': s['avgTransportDay']
        })
    result.sort(key=lambda x: x['avgDailyBudget'], reverse=True)
    return result

def compute_destination_groups(data):
    groups = defaultdict(list)
    for d in data:
        groups[d['destination']].append(d)

    result = []
    for dest, profiles in groups.items():
        first = profiles[0]
        daily_budgets = [p['estimatedDailyBudgetUSD'] for p in profiles]
        ratings = [p['averageTravelerRating'] for p in profiles]
        days = [p['recommendedDays'] for p in profiles]

        result.append({
            'destination': dest,
            'country': first['country'],
            'continent': first['continent'],
            'latitude': first['latitude'],
            'longitude': first['longitude'],
            'mainInterest': first['mainInterest'],
            'bestSeason': first['bestSeason'],
            'profiles': profiles,
            'avgDailyBudget': round(sum(daily_budgets) / len(profiles)),
            'avgRating': round(sum(ratings) / len(profiles), 2),
            'avgDays': round(sum(days) / len(profiles)),
            'minBudget': min(daily_budgets),
            'maxBudget': max(daily_budgets)
        })
    result.sort(key=lambda x: x['destination'])
    return result

DESTINATION_GROUPS = compute_destination_groups(DATASET)

class TravelRequestHandler(BaseHTTPRequestHandler):
    def send_json(self, data, status=200):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        if path == '/api/stats':
            continent = query.get('continent', ['All'])[0]
            data = DATASET if continent == 'All' else [d for d in DATASET if d['continent'] == continent]
            stats = {
                'overall': compute_overall_stats(data),
                'continents': compute_continent_stats(data),
                'tripTypes': compute_trip_type_stats(data)
            }
            self.send_json(stats)
            return

        elif path == '/api/destinations':
            self.send_json(DESTINATION_GROUPS)
            return

        elif path == '/api/records':
            # Live filtering
            search = query.get('search', [''])[0].lower()
            continent = query.get('continent', [''])[0]
            trip_type = query.get('tripType', [''])[0]
            season = query.get('season', [''])[0]
            max_budget = float(query.get('maxBudget', [9999])[0])
            min_rating = float(query.get('minRating', [0])[0])

            filtered = DATASET
            if search:
                filtered = [d for d in filtered if search in d['destination'].lower() or search in d['country'].lower() or search in d['travelProfileId'].lower()]
            if continent:
                filtered = [d for d in filtered if d['continent'] == continent]
            if trip_type:
                filtered = [d for d in filtered if d['tripType'] == trip_type]
            if season:
                filtered = [d for d in filtered if d['bestSeason'] == season]
            filtered = [d for d in filtered if d['estimatedDailyBudgetUSD'] <= max_budget and d['averageTravelerRating'] >= min_rating]

            self.send_json({'count': len(filtered), 'records': filtered})
            return

        elif path == '/api/calculate':
            dest = query.get('destination', ['Tokyo'])[0]
            ttype = query.get('tripType', ['Food & Local Life'])[0]
            pax = int(query.get('travelers', [1])[0])
            record = next((d for d in DATASET if d['destination'] == dest and d['tripType'] == ttype), DATASET[0])
            days = int(query.get('days', [record['recommendedDays']])[0])

            daily = record['estimatedDailyBudgetUSD']
            hotel = record['estimatedHotelPerNightUSD']
            food = record['estimatedFoodPerDayUSD']
            transit = record['estimatedLocalTransportPerDayUSD']
            misc = max(0, daily - (hotel + food + transit))

            total_trip = daily * days * pax
            calc = {
                'record': record,
                'days': days,
                'travelers': pax,
                'dailyPerPerson': daily,
                'grandTotal': total_trip,
                'totalHotel': hotel * days,
                'totalFood': food * days * pax,
                'totalTransit': transit * days * pax,
                'totalMisc': misc * days * pax
            }
            self.send_json(calc)
            return

        elif path == '/api/export':
            self.send_response(200)
            self.send_header('Content-Type', 'text/csv')
            self.send_header('Content-Disposition', 'attachment; filename="world_travel_dataset_export.csv"')
            self.end_headers()
            with open(CSV_PATH, 'rb') as f:
                self.wfile.write(f.read())
            return

        # Serve static HTML/JS from dist if built or render direct interface
        dist_index = os.path.join(os.path.dirname(__file__), 'dist', 'index.html')
        if os.path.exists(dist_index) and path == '/':
            with open(dist_index, 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            return

        # Fallback to serving static files
        req_file = path.lstrip('/')
        if not req_file:
            req_file = 'index.html'
        candidate_paths = [
            os.path.join(os.path.dirname(__file__), 'dist', req_file),
            os.path.join(os.path.dirname(__file__), 'public', req_file),
            os.path.join(os.path.dirname(__file__), req_file)
        ]
        for cp in candidate_paths:
            if os.path.exists(cp) and os.path.isfile(cp):
                content_type = 'text/plain'
                if cp.endswith('.html'): content_type = 'text/html; charset=utf-8'
                elif cp.endswith('.css'): content_type = 'text/css'
                elif cp.endswith('.js'): content_type = 'application/javascript'
                elif cp.endswith('.json'): content_type = 'application/json'
                elif cp.endswith('.csv'): content_type = 'text/csv'
                elif cp.endswith('.svg'): content_type = 'image/svg+xml'

                with open(cp, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', content_type)
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                return

        # Default fallback 404
        self.send_response(404)
        self.end_headers()
        self.wfile.write(b'Not found')

def run_server(port=8000):
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, TravelRequestHandler)
    print(f"World Travel Dataset Python Engine running at http://localhost:{port}")
    print(f"Loaded {len(DATASET)} records across {len(DESTINATION_GROUPS)} global destinations.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', sys.argv[1] if len(sys.argv) > 1 else 8000))
    run_server(port)
