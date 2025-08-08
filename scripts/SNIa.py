import numpy as np
import pandas as pd
import platform
import sys
from scipy.integrate import quad
import requests
from io import BytesIO

# ==============================================================================
# Dynamic Fractal Cosmological Model - Pantheon+ SNIa Chi-squared Script (v2.0)
#
# Author: Sylvain Herbin (ORCID: 0009-0001-3390-5012)
# Website: www.phi-z.space
#
# This script calculates the Chi-squared/dof for the Pantheon+ SNIa dataset
# using the GLOBAL best-fit parameters of the Dynamic Fractal Model.
# ==============================================================================

# --- Diagnostic ---
print("### Execution Environment Diagnostic ###")
print(f"Python Version: {platform.python_version()}")
print(f"NumPy Version: {np.__version__}")
try:
    import scipy
    print(f"SciPy Version: {scipy.__version__}")
except ImportError:
    print("SciPy is not installed. Please install it to run this script.")
    sys.exit()
print("-" * 38 + "\n")

# --- 1. Model Definitions ---
# Define the true value of the Golden Ratio (phi) for high precision
PHI = (1 + np.sqrt(5)) / 2

def phi_z(z, Gamma, A1, A2):
    """Calculates the dynamic fractal dimension phi(z)."""
    phi_inf = PHI  # Using the high-precision Golden Ratio
    phi_0 = 2.85
    base = phi_inf + (phi_0 - phi_inf) * np.exp(-Gamma * z)
    bao_bump_1 = A1 * np.exp(-0.5 * ((z - 0.4)/0.3)**2)
    bao_bump_2 = A2 * np.exp(-0.5 * ((z - 1.5)/0.4)**2)
    return base + bao_bump_1 + bao_bump_2

def H_model(z, H0, Om, Gamma, A1, A2):
    """Calculates the theoretical H(z) from the dynamic fractal model."""
    OL = 1.0 - Om
    phi = phi_z(z, Gamma, A1, A2)
    term1 = Om * (1.0 + z)**(3.0 * phi)
    term2 = OL * (1.0 + z)**(3.0 * (2.0 - phi))
    return H0 * np.sqrt(term1 + term2)

c = 299792.458

def D_L_model(z_obs, H0, Om, Gamma, A1, A2):
    """Calculates the luminosity distance D_L(z) using quad integrator."""
    # The integral gives a result in Mpc because H0 is in km/s/Mpc and c is in km/s.
    integrand = lambda z: c / H_model(z, H0, Om, Gamma, A1, A2)
    integral, _ = quad(integrand, 0, z_obs)
    return (1.0 + z_obs) * integral

def mu_model(z, H0, Om, Gamma, A1, A2):
    """Calculates the theoretical distance modulus mu(z)."""
    dl_mpc = D_L_model(z, H0, Om, Gamma, A1, A2)
    if dl_mpc <= 0:
        return np.inf
    return 5 * np.log10(dl_mpc) + 25

# --- 2. Data and GLOBAL Optimized Parameters ---
print("--- Script for Pantheon+ SNIa using GLOBAL fit parameters ---")
print("\n[STEP 1] Loading Pantheon+ data and covariance matrix from GitHub.")

# URLs des fichiers sur votre dépôt GitHub
data_url = 'https://raw.githubusercontent.com/sylvainherbin/dfcm-ai-api/main/scripts/Pantheon+SH0ES.dat'
cov_url = 'https://raw.githubusercontent.com/sylvainherbin/dfcm-ai-api/main/scripts/Pantheon+SH0ES_STAT+SYS.cov'

try:
    # Use pandas to read the .dat file directly from the URL
    snia_data_df = pd.read_csv(data_url, delim_whitespace=True, comment='#')

    # Filter out calibrators
    is_calibrator_mask = (snia_data_df['IS_CALIBRATOR'] == 1)
    snia_data_filtered = snia_data_df[~is_calibrator_mask]
    
    z_data = snia_data_filtered['zHD'].values
    mu_obs = snia_data_filtered['MU_SH0ES'].values
    
    num_total_sn = len(snia_data_df)
    non_calibrator_indices = snia_data_df.index[~is_calibrator_mask].values
    
    # Download the covariance matrix file using requests
    cov_response = requests.get(cov_url)
    if cov_response.status_code != 200:
        raise Exception(f"Failed to download covariance file. Status: {cov_response.status_code}")
        
    cov_data = np.loadtxt(BytesIO(cov_response.content), skiprows=1)
    
    full_cov_matrix = cov_data.reshape((num_total_sn, num_total_sn))
    cov_matrix = full_cov_matrix[non_calibrator_indices, :][:, non_calibrator_indices]

    num_data_points = len(z_data)
    print(f"-> Successfully loaded {num_data_points} non-calibrator SNIa.")

except Exception as e:
    print(f"-> ERROR: Failed to process data files from URLs. {e}")
    sys.exit()

print(f"\n[STEP 2] Defining the GLOBAL best-fit parameters from the paper.")
H0_opt, Om_opt, Gamma_opt, A1_opt, A2_opt = (73.24, 0.2974, 0.433, 0.031, 0.019)
model_args = (H0_opt, Om_opt, Gamma_opt, A1_opt, A2_opt)
print(f"-> Parameters: H0={H0_opt}, Om={Om_opt}, Gamma={Gamma_opt}, A1={A1_opt}, A2={A2_opt}, phi_inf={PHI}")

# --- 3. Calculation of Chi-squared ---
print("\n[STEP 3] Calculating theoretical distance moduli (this may take a moment).")
mu_model_pred = np.array([mu_model(z, *model_args) for z in z_data])

print("\n[STEP 4] Computing the Chi-squared value.")
diff_vector = mu_obs - mu_model_pred
inv_cov_matrix = np.linalg.inv(cov_matrix)
chi2_snia = diff_vector.T @ inv_cov_matrix @ diff_vector

# --- 4. Final Results ---
print("\n[STEP 5] Calculating the final Chi^2/dof.")
num_parameters = 5
dof = num_data_points - num_parameters
chi2_dof = chi2_snia / dof

print(f"-> Degrees of freedom (dof): {dof}")
print("-" * 45)
print(f"FINAL RESULT: Chi^2 value = {chi2_snia:.3f}")
print(f"FINAL RESULT: Chi^2/dof for Pantheon+ SNIa = {chi2_dof:.3f}")
print("-" * 45)

# Note on the expected result
print(f"\n[NOTE]: The expected result is around 0.613. The slight difference is expected due to the high-precision phi value.")
