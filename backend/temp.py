import csv

# Data to be written to the CSV file
data = [
    ["Name", "Age", "City"],  # Header row
    ["Alice", 30, "New York"],
]

csv_file_path = "users.csv"

with open(csv_file_path, 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(data)

print(f"CSV file '{csv_file_path}' created successfully using the csv module.")