# Load model directly
from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("SN12/llama-2-7b-advisor")
model = AutoModelForCausalLM.from_pretrained("SN12/llama-2-7b-advisor")

# prompt the model
prompt = "Hello, how are you?"
input_ids = tokenizer.encode(prompt, return_tensors="pt")
output = model.generate(input_ids, max_length=1000, do_sample=True, top_p=0.95, top_k=60)

print(tokenizer.decode(output[0], skip_special_tokens=True))