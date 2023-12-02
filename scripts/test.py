from datasets import load_dataset

# Load dataset from Parquet file
dataset = load_dataset("parquet", data_files="synthetic-data/data.parquet")

# print the first 5 rows of the dataset
print(dataset['train'][0:5])