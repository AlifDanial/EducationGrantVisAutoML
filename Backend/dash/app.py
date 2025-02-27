from flask import Flask, g, jsonify
from dash import Dash, html, dcc, Input, Output, State
import plotly.express as px
import pandas as pd
from .middleware import InstanceIsolationMiddleware, require_instance_id, current_instance
import os
import json

# Initialize Flask app
server = Flask(__name__)

# Add instance isolation middleware
server.wsgi_app = InstanceIsolationMiddleware(server.wsgi_app)

# Initialize Dash app
app = Dash(
    __name__,
    server=server,
    url_base_pathname='/',
    external_stylesheets=[
        'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'
    ]
)

# Configure instance-specific data directory
def get_instance_data_dir():
    """Get the data directory for the current instance."""
    instance_id = current_instance
    if not instance_id:
        raise ValueError("Instance ID is required")
    
    data_dir = os.path.join('data', f'instance_{instance_id}')
    os.makedirs(data_dir, exist_ok=True)
    return data_dir

def load_model_data(model_id):
    """Load model data for the current instance."""
    data_dir = get_instance_data_dir()
    data_file = os.path.join(data_dir, f'model_{model_id}.csv')
    if os.path.exists(data_file):
        return pd.read_csv(data_file)
    return None

# Flask routes
@server.route('/health')
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy'})

@server.route('/data/<model_id>')
@require_instance_id
def get_model_data(model_id):
    """Get model data for the current instance."""
    try:
        data = load_model_data(model_id)
        if data is None:
            return jsonify({'error': 'Model data not found'}), 404
        return jsonify({
            'status': 'success',
            'model_id': model_id,
            'instance_id': current_instance,
            'data': data.to_dict(orient='records')
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Dash layout
app.layout = html.Div([
    html.Div([
        html.H1('VisAutoML Dashboard', className='text-center mb-4'),
        html.Div([
            dcc.Dropdown(
                id='model-selector',
                placeholder='Select a model'
            ),
            html.Div(id='model-info', className='mt-3'),
        ], className='col-md-8 offset-md-2')
    ], className='container mt-4'),
    
    html.Div([
        html.Div([
            dcc.Graph(id='performance-plot')
        ], className='col-md-6'),
        html.Div([
            dcc.Graph(id='feature-importance-plot')
        ], className='col-md-6')
    ], className='row mt-4'),
    
    html.Div([
        html.Div([
            html.H3('Model Predictions', className='text-center'),
            html.Div(id='predictions-table')
        ], className='col-12 mt-4')
    ], className='row'),
    
    # Store for instance ID
    dcc.Store(id='instance-id', data=current_instance),
    
    # Interval for data refresh
    dcc.Interval(
        id='interval-component',
        interval=30*1000,  # 30 seconds
        n_intervals=0
    )
], className='container-fluid')

# Callbacks
@app.callback(
    [Output('model-info', 'children'),
     Output('performance-plot', 'figure'),
     Output('feature-importance-plot', 'figure'),
     Output('predictions-table', 'children')],
    [Input('model-selector', 'value'),
     Input('interval-component', 'n_intervals')],
    [State('instance-id', 'data')]
)
def update_dashboard(model_id, n_intervals, instance_id):
    """Update dashboard with model data."""
    if not model_id:
        return "Please select a model", {}, {}, ""
    
    try:
        data = load_model_data(model_id)
        if data is None:
            return "Model data not found", {}, {}, ""
        
        # Create performance plot
        perf_fig = px.line(
            data,
            title='Model Performance Over Time'
        )
        
        # Create feature importance plot
        feat_fig = px.bar(
            data,
            title='Feature Importance'
        )
        
        # Create predictions table
        table = html.Table(
            # Add table contents here
            className='table table-striped'
        )
        
        return [
            f"Model {model_id} - Instance {instance_id}",
            perf_fig,
            feat_fig,
            table
        ]
    except Exception as e:
        return str(e), {}, {}, ""

if __name__ == '__main__':
    app.run_server(host='0.0.0.0', port=8050, debug=True) 