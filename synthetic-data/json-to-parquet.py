import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq

# Read JSON file
json = pd.read_json('synthetic-data/data.json')

df = pd.DataFrame(json)

# Convert to Arrow Table
table = pa.Table.from_pandas(df)

# Write Arrow Table to Parquet
pq.write_table(table, 'synthetic-data/data.parquet')

