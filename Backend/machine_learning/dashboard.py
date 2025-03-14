from explainerdashboard import ExplainerDashboard
import sys
import joblib
import os

def runModel(filename, port=8050):
    """
    Run an ExplainerDashboard for a specific model on a specific port.
    
    Args:
        filename: The model filename (without extension)
        port: The port to run the dashboard on (default: 8050)
    
    Returns:
        None
    """
    # Kill any existing process on the specified port
    os.system(f"npx kill-port {port}")
    
    # Run the dashboard on the specified port
    os.system(f"explainerdashboard run {filename}.yaml --port {port} --no-browser")

    # os.system('explainerdashboard run '+filename+'.joblib')
