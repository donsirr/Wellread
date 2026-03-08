import json
import os

with open('state.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# The existing data is just the root object
juan = {
    'id': '1',
    'patientProfile': data.get('patientProfile', {}),
    'mcpSources': data.get('mcpSources', []),
    'clinicalMetrics': data.get('clinicalMetrics', []),
    'correlations': data.get('correlations', []),
    'healthGaps': data.get('healthGaps', []),
    'narrative': data.get('narrative', {}),
    'consultation': data.get('consultation', {})
}

for src in juan['mcpSources']:
    src['privacyStatus'] = 'local_only'

new_state = {
    'searchKeywords': {
        'metric-hba1c': ['sugar', 'glucose', 'A1c', 'diabetes', 'sweet', 'lab'],
        'metric-bp': ['pressure', 'heart', 'tension', 'hyper', 'stress']
    },
    'patientDatabase': [
        juan,
        {
            'id': '2',
            'patientProfile': {
                'name': 'Maria Dela Cruz',
                'age': 62,
                'conditions': ['Hypertension'],
                'dob': 'Jan 1, 1964'
            },
            'mcpSources': [],
            'clinicalMetrics': [],
            'correlations': [],
            'healthGaps': ['Institutional record exists'],
            'narrative': None,
            'consultation': None
        },
        {
            'id': '3',
            'patientProfile': {
                'name': 'John Doe',
                'age': 45,
                'conditions': ['New Patient'],
                'dob': 'Jan 1, 1981'
            },
            'mcpSources': [],
            'clinicalMetrics': [],
            'correlations': [],
            'healthGaps': ['No Institutional record', 'Build Intake via MCP flag'],
            'narrative': None,
            'consultation': None
        },
        {
            'id': '4',
            'patientProfile': {
                'name': 'Jane Doe',
                'age': 30,
                'conditions': ['Annual Wellness'],
                'dob': 'Jan 1, 1996'
            },
            'mcpSources': [],
            'clinicalMetrics': [],
            'correlations': [],
            'healthGaps': ['MCP Sync ready'],
            'narrative': None,
            'consultation': None
        }
    ]
}

with open('state.json', 'w', encoding='utf-8') as f:
    json.dump(new_state, f, indent=4)

print('State updated successfully!')
