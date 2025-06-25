import pandas as pd

# Load the Excel file
excel_file = 'FEBList.xlsx'

# Convert to a DataFrame
df = pd.read_excel(excel_file)

# Convert to JSON with "faces" as the root key
data = {"AllFEB": df.to_dict(orient="records")}

# Save to JSON file
json_file = "cubeConfig.json"
with open(json_file, "w") as f:
    import json
    json.dump(data, f, indent=4)

print(f"JSON saved to {json_file}")
