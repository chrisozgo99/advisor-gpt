import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq

# Read JSON file
json = pd.read_json('data/synthetic-data/question-answer-pairs.json')

df = pd.DataFrame(json)

# Convert to Arrow Table
table = pa.Table.from_pandas(df)

# Write Arrow Table to Parquet
pq.write_table(table, 'data/synthetic-data/data.parquet')

