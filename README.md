# advisor-gpt
Georgia Tech ECE Curriculum Advisor as an LLM, fine-tuned on Facebook's open-source Llama model

## Installation
Clone this repository using `git clone https://github.com/chrisozgo99/advisor-gpt.git`

## Usage
### Setup on Pace ICE Cluster (Georgia Tech)
1. Turn on the [Georgia Tech VPN](https://vpn.gatech.edu/global-protect/login.esp)
2. SSH into the Pace ICE Cluster using `ssh <username>@login-ice.pace.gatech.edu`
3. `mkdir scratch` if you don't already have a scratch directory
4. `cd scratch`
5. run `salloc -N1 --mem-per-gpu=12G -t0:45:00 --gres=gpu:A100:1 --ntasks-per-node=6` to allocate a GPU node. Note: our model can only one on an A100 GPU. Anything less and it will run out of memory.
6. Clone the repository in the scratch folder using `git clone https://github.com/chrisozgo99/advisor-gpt.git`
7. `cd advisor-gpt`
8. `module load anaconda3/2022.05`
9. Create a conda environment using `conda create --name <env_name>`
10. Activate the environment using `conda activate <env_name>`
11. Run `conda install pytorch -c pytorch` to install pytorch
12. Install the requirements using `pip install -r requirements.txt`. Note: this may encounter some issues. If so, just install the packages in requirements.txt manually.
13. `module load pytorch`
14. All our scripts are located in the `advisor-gpt/scripts` folder. Running `python scripts/fine-tune-pace` will fine-tune the model on the Pace ICE Cluster and query the model for answers to some pre-set questions.

### Setup on Google Colab
1. Open the `jupyter-notebooks/LLAMA_2_FINE_TUNING_Lora.ipynb` notebook in Google Colab
2. Select a GPU runtime (this does not require the A100 GPU)
3. Run the notebook

Both the steps for Pace ICE and Google Colab achieve the same result of fine-tuning the model on our dataset.

