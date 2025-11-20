import pandas as pd

def load_dataset(provider: str):
    try:
        provider = provider.lower()
        if provider == "ipcc":
            file_path = "data/ipcc_ar6_sample.csv"
        elif provider == "iea":
            file_path = "data/iea_weo_sample.csv"
        else:
            return {"error": "Unknown provider"}
        
        df = pd.read_csv(file_path)
        return df.to_dict(orient='records')
    except FileNotFoundError:
        return {"error": "Dataset not found"}
