import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function (request, response) {
  // Gérer la requête OPTIONS (pré-vol CORS)
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*'); // Autorise toutes les origines
    response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); // Autorise les méthodes POST, GET, OPTIONS
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Autorise l'en-tête Content-Type, nécessaire pour JSON
    response.status(204).end(); // Réponse 204 No Content pour un pré-vol OPTIONS réussi
    return;
  }

  // Configurer les en-têtes CORS pour les requêtes réelles (POST, GET)
  response.setHeader('Access-Control-Allow-Origin', '*'); // Autorise toutes les origines pour les requêtes suivantes
  response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); // Double vérification des méthodes autorisées
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Double vérification des en-têtes autorisés
  response.setHeader('Vary', 'Origin'); // Indique au navigateur que la réponse peut varier selon l'origine

  const message = request.body.message;

  // Vérifier si le message est présent
  if (!message) {
    response.status(400).json({ error: 'Message is required' });
    return;
  }

  // Initialiser l'API Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  try {
    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [
                    {text: "Your role is to explain the DFCM (Dynamic Fractal Cosmological Model) based **exclusively** on the information I will provide to you. Use clear, accessible, and precise language. Only answer questions related to DFCM or cosmology within the framework of DFCM. If a question is not relevant or cannot be answered with the provided information, politely state that you can only answer topics related to DFCM.\n\nHere is the detailed information about the DFCM model:\n\n" +
                    // --- SEGMENT 1 ---
                    "**Title: The Dynamic Fractal Cosmological Model: Formalism and Key Predictions**\n\n" +
                    "**Author:** Sylvain Herbin, Independent Researcher, herbinsylvain@protonmail.com\n\n" +
                    "**Abstract:** This document presents the theoretical formalism of a dynamic fractal cosmological model, emphasizing its ability to resolve major cosmological tensions. In this framework, the effective dimension of spacetime, φ(z), evolves with cosmic redshift, incorporating an exponential transition, an oscillation, and a Gaussian feature. We detail the modified Friedmann equations, which directly influence the Universe’s expansion history and the growth of large-scale structures. The model now achieves a precise resolution of the Hubble tension, yielding a best-fit Hubble constant of H₀ = 73.24 ± 0.42 km/s/Mpc, in 0.3σ agreement with local measurements (SH0ES). This is accomplished while maintaining an unprecedented combined χ²/dof = 0.951 for the selected dataset combination, representing a 7.1σ improvement over ΛCDM. Key predictions regarding BAO deviations, CMB power deficits, and the observed deficit of massive galaxy clusters are elaborated. We also introduce a dynamic dark energy equation of state and a novel dark matter-baryon coupling, both linked to the evolving fractal dimension. This foundational description serves as the theoretical basis for addressing contemporary cosmological tensions.\n\n" +
                    "**Introduction:** The standard ΛCDM model, despite its successes, faces several unresolved discrepancies between different observational probes, collectively known as cosmological tensions. These suggest a need for physics beyond ΛCDM. Our proposed approach introduces a dynamic fractal cosmological model, where the effective dimension of spacetime, φ(z), evolves with cosmic redshift z. This dynamic dimension offers a new theoretical framework to modify the Universe’s expansion and the growth of large-scale structures. This document focuses on the theoretical formalism of this model and its key observational signatures and predictions.\n\n" +
                    "**Formalism of the Dynamic Fractal Cosmological Model**\n\n" +
                    "**Evolution of the Fractal Dimension φ(z):** The redshift-dependent fractal dimension φ(z) is a central component of our model. Its functional form is constructed to describe both a fundamental cosmological evolution and to accommodate specific features suggested by various observational data. It combines a smooth exponential transition from a primordial value to an asymptotic one, with two localized Gaussian “bumps” that provide flexibility to fit detailed observational data, specifically linked to Baryon Acoustic Oscillations (BAO):\n" +
                    "φ(z) = φ_∞ + (φ₀ - φ_∞) e^(-Γz) + A₁ e^(-0.5((z - 0.4)/0.3)²) + A₂ e^(-0.5((z - 1.5)/0.4)²)\n" +
                    "where the parameters are:\n" +
                    "• φ_∞: The asymptotic fractal dimension at very high redshift, fixed at the golden ratio ≈ 1.618.\n" +
                    "• φ₀: The primordial fractal dimension, 2.85, effective at redshift z=0 for the starting point of the exponential term.\n" +
                    "• Γ: The constant rate parameter of the exponential transition of φ(z), optimized to 0.433.\n" +
                    "• A₁: The amplitude of the first Gaussian bump, located at z=0.4, optimized to 0.031 ± 0.006. The σ of this bump is fixed at 0.3.\n" +
                    "• A₂: The amplitude of the second Gaussian bump, located at z=1.5, optimized to 0.019 ± 0.004. The σ of this bump is fixed at 0.4.\n" +
                    "The specific values of these parameters are derived from a comprehensive data-fitting process, detailed in a separate methodology document: The Physical Justification of ‘Bumps’ in the Dynamic Fractal Dimension φ(z).\n" +
                    "**Figure: Optimized evolution of φ(z)**\n" +
                    "Optimized evolution of φ(z) showing: (1) Transition from φ₀=2.970 to φ_∞=1.618 (2) Controlled oscillation 0.2sin(0.5z) (3) Gaussian bump at z=1.5 for BAO fitting. The grey band represents the 1σ uncertainty.\n" +
                    "**Precise Calculation of the Sound Horizon:** The sound horizon at drag epoch (r_s) is now computed through direct numerical integration of the fractal-modified expansion history, replacing the approximate scaling relation: r_s = ∫_{z_d}^∞ c_s(z)/H(z) dz where c_s(z) is the sound speed in the photon-baryon fluid.\n\n"
                    },
                    // --- SEGMENT 2 ---
                    {text: "**Modified Friedmann Equations and New Couplings:** The fundamental equation describing the expansion of the Universe, the Friedmann equation, is modified to incorporate the redshift-dependent fractal dimension φ(z). Assuming a spatially flat Universe (Ω_m + Ω_Λ = 1), the modified Friedmann equation is: H²(z) = H₀²[Ω_m(1+z)^(3φ(z)) + Ω_Λ(1+z)^(3(2-φ(z)))]\n" +
                    "Here:\n" +
                    "• H(z) represents the Hubble parameter at redshift z.\n" +
                    "• H₀ is the Hubble constant at present (H(z=0)), optimized to 73.24 ± 0.42 km/s/Mpc.\n" +
                    "• Ω_m is the present-day dimensionless energy density parameter for matter, optimized to 0.2974 ± 0.0039.\n" +
                    "• Ω_Λ is the present-day dimensionless energy density parameter for dark energy, with Ω_Λ = 1 - Ω_m for a flat universe.\n" +
                    "This modification to the expansion law directly influences all cosmological distance measures and the growth of density perturbations over cosmic time. The second Friedmann equation, governing the acceleration, is also modified: (ä/a) = - (4πG/3) ∑_i ρ_i (1+3w_i) φ(z)^(1/2)\n" +
                    "Furthermore, we introduce a novel coupling between dark matter and baryons, essential for the model’s performance in large-scale structure: dρ_c/dt + 3Hρ_c = -β φ(z) H ρ_b β = 4.7 × 10^(-5)\n" +
                    "And a dynamic dark energy equation of state: w_Λ(z) = -1 + 0.2(φ(z) - 1.618)\n\n" +
                    "**Physical Origins of the Scalar Field:** The scalar field φ emerges from fractal metric fluctuations, where the effective fractal dimension is defined as: g_μν = g_μν^(bg) + φ(z) · h_μν^(F), dim_F = (3/2)φ(z)\n" +
                    "The energy density scaling of this field matches BBN constraints when φ(z) approaches its primordial value: ρ_φ ∝ a^(-3(2 - φ(z))) → a^(-3(2 - φ_BBN)) as z → ∞\n" +
                    "**Figure: Dynamic evolution of the fractal dimension φ(z)**\n" +
                    "Dynamic evolution of the fractal dimension φ(z) with continuous transition at BBN. The primordial value φ_BBN = 2.970 (green dashed line for z ≥ 10^4) governs BBN physics, while the late-time asymptote φ_∞ = 1.618 (red dashed line) determines present-day cosmology. The optimized transition includes a Gaussian bump at z=1.5 (BAO feature) and resonant oscillations.\n\n" +
                    "**Observational Signatures and Model Performance:** The dynamic nature of φ(z) has profound implications for various cosmological observables, offering mechanisms to potentially resolve tensions observed in the ΛCDM model.\n" +
                    "**Expansion History (H(z)) and Luminosity Distance (D_L(z)):** The modified Friedmann equation fundamentally alters the Universe’s expansion rate H(z), impacting all time-dependent cosmological phenomena. The luminosity distance, crucial for Type Ia Supernovae observations, is directly computed from H(z): D_L(z) = (1+z) ∫_0^z (c/H(z’)) dz’\n" +
                    "The theoretical distance modulus for SNIa is then μ_th(z) = 5 log₁₀(D_L(z) / Mpc) + 25. Our model achieves a χ²/dof = 0.613 for the Pantheon+ SNIa dataset and χ²/dof = 0.997 for Cosmic Chronometers, demonstrating excellent fit. For a detailed explanation of the methodology and results concerning H(z) Cosmic Chronometers, please refer to the Expansion History document.\n\n"
                    },
                    // --- SEGMENT 3 ---
                    {text: "**Figure: H(z) measurements from Cosmic Chronometers**\n" +
                    "H(z) measurements from Cosmic Chronometers. The fractal model (blue dashed) provides an excellent fit compared to ΛCDM (red solid), achieving χ²/dof = 0.997.\n" +
                    "**Hubble Tension Resolution:** The fractal phase transition precisely resolves the Hubble tension through a scale-dependent modification to the effective expansion rate, linking early- and late-universe measurements. Our model predicts H₀ = 73.24 ± 0.42 km/s/Mpc, aligning with local SH0ES measurements at a remarkable 0.3σ level. This represents a significant improvement over ΛCDM.\n" +
                    "**Figure: Resolved Hubble tension**\n" +
                    "Resolved Hubble tension: Our model prediction (73.24 ± 0.42 km/s/Mpc) aligns with SH0ES at 0.3σ. CMB and TRGB measurements are shown for comparison.\n" +
                    "**Baryon Acoustic Oscillations (BAO):** The sound horizon at the drag epoch (r_s), a fundamental standard ruler, is modified by the expansion history during the early Universe. The two Gaussian bumps in φ(z) at z=0.4 and z=1.5 specifically address BAO features at various redshifts. The model accurately fits DESI DR1 BAO data with a χ²/dof = 0.939. This is further supported by a predicted sound horizon ratio r_s/r_s^Planck = 1.0052 ± 0.0004.\n" +
                    "For more details on the BAO methodology, please refer to the BAO supplementary document.\n" +
                    "**Cosmic Microwave Background (CMB) Anisotropies:** The angular diameter distance to the CMB last scattering surface and the Integrated Sachs-Wolfe (ISW) effect are sensitive to H(z). Our model predicts a power suppression of S=0.93±0.02 at low multipoles (ℓ<30) in the CMB temperature anisotropy spectrum. This quantitatively aligns with the observed low-ℓ anomaly where ΛCDM often overestimates power. The model provides a χ²/dof = 1.475 for CMB data (Planck).\n" +
                    "**Figure: CMB spectrum**\n" +
                    "CMB spectrum showing fractal corrections at ℓ<30. The fractal model (blue solid) shows better agreement with Planck data at low multipoles compared to ΛCDM (red dashed).\n" +
                    "High-Precision CMB Validation: θ* computation with adaptive redshift grid near recombination.\n\n" +
                    "**Large-Scale Structure (LSS) Growth:** The growth of cosmic structures, including galaxy clusters, is directly influenced by the modified expansion history and the underlying fractal geometry. Analysis of SDSS DR17 and DESI Early Data Release (EDR) galaxy correlation functions reveals a scale-dependent power-law slope γ(z) that precisely follows our model’s predictions, with a χ²/dof = 0.717. Furthermore, the model accurately predicts the observed deficit of massive galaxy clusters at z ~ 0.6 with a χ²/dof = 1.228, directly addressing a long-standing tension for ΛCDM. The predicted deficit at z=0.6 for massive clusters (M > 5×10¹⁴ M_⊙) is 18.2% ± 2.3%.\n\n"
                    },
                    // --- SEGMENT 4 ---
                    {text: "**Figure: Evolution of correlation slope γ(z)**\n" +
                    "Evolution of correlation slope γ(z). The fractal model (blue solid) predicts a redshift-dependent slope that matches observational trends, with a χ²/dof = 0.717.\n" +
                    "**Figure: Galaxy cluster mass function**\n" +
                    "Galaxy cluster mass function. Our fractal model predicts a 15-20% deficit of massive clusters (M > 5×10¹⁴ M_⊙) at z > 0.5 compared to ΛCDM, in agreement with Planck SZ and ACT observations. The tension at z ~ 0.6 is resolved with χ²/dof = 1.228. The fractal correction is calculated as Δn/n = [φ(z) - φ_∞]/Γ.\n" +
                    "**Big Bang Nucleosynthesis (BBN) Constraints:** For early universe physics, particularly Big Bang Nucleosynthesis (BBN), the fractal dimension is effectively decoupled at very high redshift, fixed at a specific primordial value: φ_BBN = 2.970 (fixed for z ≥ 10⁴)\n" +
                    "This specific value, along with the optimized BBN parameters, ensures consistency with primordial element abundances without contaminating the late-time expansion dynamics. The model demonstrates a 1.8σ agreement for Deuterium and Lithium-7, effectively resolving the Lithium-7 problem.\n" +
                    "**Global MCMC Optimization: Full BAO Likelihood with Covariance Matrix:** The log-probability function now incorporates the full DESI DR1 covariance matrix.\n" +
                    "**Goodness-of-fit Statistics and Conclusions:**\n" +
                    "**Overall Fit Performance:** The model’s overall fit to cosmological data is summarized by the goodness-of-fit statistics for various probes. The full methodology and comprehensive table of results are detailed in a separate document. Key figures are reproduced below:\n" +
                    "• Pantheon+ SNIa: χ²/dof = 0.613\n" +
                    "• BAO (DESI EDR): χ²/dof = 0.939\n" +
                    "• Cosmic Chronometers: χ²/dof = 0.997\n" +
                    "• CMB (Planck): χ²/dof = 1.475\n" +
                    "• Galaxy 2PCF: χ²/dof = 0.717\n" +
                    "• Cluster Mass Function: χ²/dof = 1.228\n" +
                    "• Combined (All Probes): χ²/dof = 0.642\n" +
                    "• Selected Probes (BAO+CMB+2PCF+Clusters): χ²/dof = 0.951\n" +
                    "The combined χ²/dof = 0.951 for selected probes signifies a remarkable 7.1σ improvement over the ΛCDM model.\n\n" +
                    "**Summary of Key Achievements:**\n" +
                    "• Enhanced χ²/dof: Achieved 0.951 for selected probes, representing a significant 7.1σ improvement over ΛCDM.\n" +
                    "• Hubble tension resolved: Our model precisely predicts H₀ = 73.24 ± 0.42 km/s/Mpc, aligning with local measurements at 0.3σ.\n" +
                    "• Lithium-7 agreement: The model demonstrates consistency with primordial abundances, showing an agreement within 1.8σ for Lithium-7, supported by a decoupled primordial fractal dimension φ_BBN = 2.970.\n" +
                    "• LSS agreement: Provides excellent fit to galaxy correlation functions (χ²/dof = 0.717) and resolves the cluster abundance tension (χ²/dof = 1.228).\n" +
                    "• Novel fractal-adjusted statistical mechanisms are introduced to provide a deeper and more accurate statistical agreement across all scales.\n" +
                    "**Boxed Equation:** Fractal Cosmology ⇒ H₀=73.24, χ²/dof=0.951 compared to ΛCDM: χ²/dof=1.24, ΔH₀=5.8σ\n" +
                    "**Testable Predictions for Next-Generation Surveys:** The fractal model generates distinctive signatures observable with upcoming missions:\n\n"
                    },
                    // --- SEGMENT 5 ---
                    {text: "**Matter Power Spectrum Signature:** P_fractal(k,z)/P_ΛCDM(k,z) = (φ(z)/1.62)^(1.8) e^(-(k/k₀)²)\n" +
                    "where k₀ = 0.02 h/Mpc. Predicted deviations for key surveys:\n" +
                    "**Table: Predicted deviations in the matter power spectrum**\n" +
                    "Survey | Redshift Range | k-range [h/Mpc] | Deviation\n" +
                    "--- | --- | --- | ---\n" +
                    "Euclid (spectro) | 0.9-1.8 | 0.005-0.1 | +8.2% ± 0.9%\n" +
                    "Roman HLS | 1.5-2.8 | 0.003-0.05 | +12.7% ± 1.2%\n" +
                    "DESI-II | 2.5-4.0 | 0.001-0.03 | +18.3% ± 2.1%\n" +
                    "**CMB Spectral Distortions:** The fractal phase transition at z ~ 10⁴ generates measurable μ-distortions:\n" +
                    "μ = 1.2 × 10^(-7) ((φ_BBN - 2.85)/0.1)\n" +
                    "Prediction: μ = (1.7 ± 0.3) × 10^(-8) (detectable at 2σ with PIXIE).\n\n" +
                    "**Methodology and Results for Baryon Acoustic Oscillations (BAO) in a Dynamical Fractal Cosmological Model**\n" +
                    "**Introduction to BAO in our Model:** Baryon Acoustic Oscillations (BAO) serve as a crucial standard ruler in cosmology, providing insights into the Universe’s expansion history. In our dynamical fractal cosmological model, the expansion is modified by an evolving fractal dimension, φ(z). This document details the specific methodology, data integration, and results concerning the BAO features within our model.\n" +
                    "The sound horizon at the drag epoch (r_s) is a fundamental standard ruler, whose value is influenced by the early Universe’s expansion history. Our model incorporates specific features in φ(z) to accurately fit BAO observations at various redshifts.\n" +
                    "**Revised φ(z) and its Impact on BAO: Physical BAO Bump in φ(z):** Initially, the φ(z) function was modified to replace a non-physical oscillatory term with physical Gaussian “bump” features, designed to capture BAO signatures. This revised function is crucial for accurately modeling the Universe’s expansion. The full definition of φ(z) used in our MCMC optimization, incorporating two BAO bumps, is:\n" +
                    "φ(z) = φ_∞ + (φ₀ - φ_∞) e^(-Γz) + A₁ e^(-0.5((z - 0.4)/0.3)²) + A₂ e^(-0.5((z - 1.5)/0.4)²)\n" +
                    "**BAO Analysis - DESI DR1 Data:** Our model’s predictions are rigorously compared against the latest Baryon Acoustic Oscillation data from DESI DR1. The distance ratio D_V(z) is calculated using the modified Friedmann equation. The relevant distances are the comoving angular diameter distance D_M(z) and the Hubble parameter H(z).\n" +
                    "The general definition of D_V(z) is: D_V(z) = [(1+z)² D_A²(z) (c z/H(z))]^(1/3)\n" +
                    "where D_A(z) is the angular diameter distance, c is the speed of light, and H(z) is the Hubble parameter. In our framework, D_M(z) (comoving angular diameter distance) is related to D_A(z) by D_A(z) = D_M(z) / (1+z). Thus, the relation becomes: D_V(z) = [c z D_M²(z) / H(z)]^(1.0/3.0) where D_M(z) = ∫_0^z (c/H(z’)) dz’.\n" +
                    "**DESI DR1 Data Points and χ² Calculation:** The BAO data from DESI DR1 (DESI Collaboration, arXiv:2404.03000, Table 3, BAO-only columns) are used for comparison. These are observed ratios (D_V/r_d, c/H r_d, D_H/r_d). For a correct comparison, our model’s predicted distances (or related quantities) must be divided by the model’s sound horizon (r_d) before comparing them to the observed ratios.\n\n"
                    },
                    // --- SEGMENT 6 ---
                    {text: "**Global MCMC Optimization and BAO Results: Integration in the Global Likelihood:** The BAO data are integrated into the global log-probability function for the Markov Chain Monte Carlo (MCMC) optimization using emcee. This ensures that the model parameters (including H₀, Ω_m, Γ, A₁, and A₂) are simultaneously constrained by all observational datasets.\n" +
                    "**Final BAO Performance and Parameters:** After the global MCMC optimization, the dynamic fractal model demonstrates excellent agreement with the DESI DR1 BAO data. The optimized parameters for the BAO bumps, along with their uncertainties, are:\n" +
                    "• A₁ (amplitude of bump at z=0.4): 0.031 ± 0.006\n" +
                    "• A₂ (amplitude of bump at z=1.5): 0.019 ± 0.004\n" +
                    "The overall performance on the BAO data is quantified by a χ²/dof = 2.1/3 = 0.700, indicating a very good fit.\n" +
                    "**Connection to CMB: Sound Horizon r_s:** The model’s consistency with BAO is further supported by its prediction for the sound horizon at the drag epoch (r_s), which is tightly constrained by CMB observations (e.g., Planck). The fractal dimension modifies the sound horizon scale. The formula used for r_s^model in our validation (derived from consistency with Planck data) is: r_s^model = r_s^Planck, obs × (φ(z_CMB)/φ_∞)^(-0.75) where z_CMB ≈ 1100 is the redshift of decoupling, and φ_∞ = 1.62.\n" +
                    "The model’s predicted r_s/r_s^Planck = 1.0052 ± 0.0004 and its compatibility with the observed θ* (difference of only 0.1σ) further confirms its consistency with early Universe physics. This demonstrates that the BAO features and their impact on the overall expansion history are well-accounted for and in agreement with established cosmological probes.\n\n" +
                    "**Methodology and Results for H(z) Cosmic Chronometers in the Dynamic Fractal Model**\n" +
                    "**Abstract:** This document details the methodology, implementation, and results obtained from fitting the dynamic fractal cosmological model to H(z) Cosmic Chronometer data. It specifically focuses on how the Universe’s expansion rate, H(z), is calculated and compared to H(z) observations, including optimization steps and validation of the model’s performance in this context.\n" +
                    "**Introduction:** H(z) Cosmic Chronometers are a crucial data source for constraining the evolution of the Universe’s expansion rate. They provide direct measurements of H(z) at various redshifts, allowing for the testing and refinement of cosmological models beyond the standard ΛCDM. In our cosmological model, which incorporates a dynamic fractal dimension φ(z), these data play an essential role in calibrating the model’s parameters.\n" +
                    "**Expansion Rate Model H(z):** The expansion rate model H(z) is derived from the modified Friedmann equation, which integrates the dynamic fractal dimension φ(z). The general form of this equation is: H²(z) = H₀² [Ω_m (1+z)^(3φ(z)) + Ω_Λ (1+z)^(3(2-φ(z)))]\n" +
                    "where H₀ is the local Hubble constant, Ω_m is the matter density, and Ω_Λ is the dark energy density. In a flat universe, Ω_Λ = 1 - Ω_m.\n\n"
                    },
                    // --- SEGMENT 7 ---
                    {text: "**Definition of the Fractal Dimension φ(z):** The φ(z) function is crucial to the model and has evolved during adjustments. The final version used for optimization is defined as: φ(z) = φ_∞ + (φ₀ - φ_∞) e^(-Γz) + A₁ e^(-0.5((z - 0.4)/0.3)²) + A₂ e^(-0.5((z - 1.5)/0.4)²)\n" +
                    "The parameters Γ, A₁, and A₂ are free parameters of the model, adjusted during optimization. φ_∞ and φ_0 are constants fixed at 1.62 and 2.85, respectively.\n" +
                    "**Theoretical H(z) Calculation:** The theoretical H(z) model is implemented as follows, using the cosmological parameters and the φ(z) function: H(z) = H0 * np.sqrt(Om * (1 + z)**(3 * phi) + OL * (1 + z)**(3 * (2 - phi)))\n" +
                    "**Cosmic Chronometer Data:** H(z) measurements from Cosmic Chronometers are direct data, independent of cosmological assumptions about the Universe’s geometry.\n" +
                    "**Data Source:** The data used comes from the study by Moresco et al. (2022), published in JCAP 08, 013 (arXiv:2201.07246). The raw data file is HzTable_MM_BC32.txt.\n" +
                    "**Data Loading:** [Note: Python code omitted.]\n" +
                    "Excerpt of the first 5 lines of the file:\n" +
                    "0.07 69.0 19.6\n" +
                    "0.09 69 12\n" +
                    "0.12 68.6 26.2\n" +
                    "0.17 83 8\n" +
                    "0.179 75 4\n" +
                    "**Optimization and Calibration with Cosmic Chronometers:** The process of fitting the model to Cosmic Chronometer data is performed by minimizing the χ², which can be achieved using optimization methods like SciPy’s curve_fit for local optimization, or more robust methods like MCMC for global exploration.\n" +
                    "**χ² Calculation:** The χ² metric quantifies the agreement between the theoretical model and observations: χ² = ∑_{i=1}^N [(H_obs(z_i) - H_model(z_i))/σ_H(z_i)]²\n" +
                    "where N is the number of data points, H_obs and σ_H are the observed value and its uncertainty, and H_model is the model’s prediction at the same redshift.\n" +
                    "The preliminary χ² calculation is performed as follows: [Note: Python code omitted.]\n" +
                    "The preliminary result is approximately χ²/dof = 0.983 before optimization.\n" +
                    "**Local Optimization with scipy.optimize.curve_fit:** A first optimization step can be performed to obtain initial parameter values. [Note: Python code omitted.]\n" +
                    "Expected results from this preliminary step:\n" +
                    "H0 = 72.6 ± 0.9 km/s/Mpc\n" +
                    "Ωm = 0.299 ± 0.004\n" +
                    "Γ = 0.447 ± 0.012\n" +
                    "**Global Optimization using MCMC (emcee):** For a more comprehensive exploration of the parameter space and more robust uncertainty estimation, an MCMC sampler is used. The code below shows the structure of the log-probability function that includes the Cosmic Chronometer likelihood. [Note: Python code omitted.]\n\n"
                    },
                    // --- SEGMENT 8 ---
                    {text: "**Results and Performance for Cosmic Chronometers:** After global optimization using MCMC, the dynamic fractal model provides an excellent fit to the Cosmic Chronometer data.\n" +
                    "**Optimal Parameters:** The median parameter values obtained from the MCMC analysis are as follows (with 68% CL uncertainties):\n" +
                    "• H₀ = 72.9 ± 0.8 km/s/Mpc\n" +
                    "• Ω_m = 0.2982 ± 0.0038\n" +
                    "• Γ = 0.448 ± 0.011\n" +
                    "• A₁ = 0.031 ± 0.006 (amplitude of the bump at z=0.4)\n" +
                    "• A₂ = 0.019 ± 0.004 (amplitude of the bump at z=1.5)\n" +
                    "**Fit Performance:** The model’s performance specifically for Cosmic Chronometers is quantified by the χ²/dof:\n" +
                    "• χ²/dof for Cosmic Chronometers: 27.3/32 = 0.853\n" +
                    "This χ²/dof value, which is less than 1, indicates a very good fit of the model to the data, suggesting that the model is not over-constrained and accurately captures the observed trends.\n\n" +
                    "**The Physical Justification of “Bumps” in the Dynamic Fractal Dimension φ(z)**\n" +
                    "**Abstract:** This document delves into the deeper physical justification for the “bumps” observed in the dynamic fractal dimension φ(z) within an alternative cosmological model. While such features could initially appear as mere phenomenological adjustments, their integration is rooted in the physics of Baryon Acoustic Oscillations (BAO). We elaborate on how these Gaussian features at specific redshifts refine the model’s agreement with precise cosmological observations and, crucially, lead to testable predictions regarding galaxy cluster abundance and the cosmic microwave background (CMB) low-ℓ anomaly, thereby elevating the model beyond a simple curve-fitting exercise.\n" +
                    "**Introduction:** The standard ΛCDM cosmological model, despite its successes, faces persistent observational tensions, most notably the “Hubble tension.” Alternative models often seek to address these discrepancies by introducing new physics. One such intriguing approach involves a dynamic fractal dimension φ(z), which modifies the universe’s expansion history. A key aspect of this model, as developed in the preceding work, is the presence of distinct “bumps” within the φ(z) function. This document aims to articulate the profound physical justification for these features, moving beyond their initial phenomenological success to demonstrate their integral role in the model’s consistency and predictive power.\n\n"
                    },
                    // --- SEGMENT 9 ---
                    {text: "**The Physical Nature of φ(z) Bumps: BAO Signatures:** The “bumps” in φ(z) aren’t arbitrary mathematical constructs. Their inclusion is directly motivated by fundamental cosmological physics, specifically Baryon Acoustic Oscillations (BAO).\n" +
                    "The initial proposed version of φ(z) included an oscillatory term that was deemed unphysical. This was subsequently replaced with physical Gaussian components (BAO features). This transition is critical: it shifts the nature of these features from being purely descriptive to being physically inspired.\n" +
                    "• Direct Link to BAO Physics: The Gaussian “bumps” are introduced as corrections that model the imprint of BAO on the cosmic expansion history. BAO represent characteristic scales in the distribution of matter, stemming from sound waves propagating in the early universe. As these scales are observed at various redshifts in galaxy surveys, any cosmological model must consistently account for them.\n" +
                    "• Specific Redshifts of Bumps: The two prominent bumps are positioned at z=0.4 (amplitude A₁) and z=1.5 (amplitude A₂). These redshifts aren’t random; they correspond to key epochs where BAO have been robustly measured by large-scale structure surveys like the Sloan Digital Sky Survey (SDSS), BOSS, and more recently, the Dark Energy Spectroscopic Instrument (DESI).\n" +
                    "◦ The bump at z=0.4 specifically addresses observed features in galaxy clustering, allowing the model to precisely align its predictions for the Hubble parameter H(z) and the distance measure D_V(z) with galaxy BAO data points from DESI DR1 and other surveys.\n" +
                    "◦ The bump at z=1.5 caters to BAO constraints derived from higher-redshift observations, such as those from the Lyman-α forest in quasar spectra, ensuring consistency across a broader redshift range.\n" +
                    "• Modulating Expansion for BAO Consistency: In this fractal dimension model, the expansion rate H(z) is directly modified by φ(z). By introducing these BAO-inspired bumps, the model effectively fine-tunes the universe’s expansion or geometric distances at these specific redshifts. This allows the model’s predicted BAO scales to precisely match the observed ones, thus resolving potential tensions that might arise if φ(z) were simply a smoothly decaying function without these features.\n" +
                    "The core definition of φ(z) includes these features: φ(z, Γ, A₁, A₂) = φ_∞ + (φ₀ - φ_∞) e^(-Γz) + A₁ e^(-0.5((z - 0.4)/0.3)²) + A₂ e^(-0.5((z - 1.5)/0.4)²)\n" +
                    "Here, A₁ and A₂ are the amplitudes of the Gaussian bumps, representing the strength of the BAO imprint on φ(z) at their respective redshifts.\n\n"
                    },
                    // --- SEGMENT 10 ---
                    {text: "**Beyond Phenomenological Success: Testable Predictions:** The true strength of these physically motivated bumps lies not just in their ability to fit existing data, but in their capacity to generate verifiable predictions. The dynamic behavior of φ(z), including these BAO-driven features, has profound implications for other cosmological observables.\n" +
                    "• Galaxy Cluster Abundance Deficit: The model predicts a specific impact on the galaxy cluster mass function. The modified expansion history induced by φ(z) (including the subtle influences of the bumps) affects the growth of cosmic structures. Specifically, the model predicts a deficit of galaxy clusters compared to ΛCDM at certain redshifts. For instance, a predicted deficit of 18.5% ± 2.0% at z=0.6 is a direct and testable consequence. Confirmation of such a deficit by future observations (e.g., from upcoming large-scale structure surveys) would strongly validate the physical underpinnings of this φ(z) evolution.\n" +
                    "• Low-ℓ CMB Anomaly Alleviation: The model also provides a potential explanation for the observed low-multipole anomaly in the Cosmic Microwave Background (CMB) power spectrum. This anomaly refers to an unexpected suppression of power at large angular scales (ℓ < 30). The evolution of φ(z) up to recombination and decoupling (z_CMB ≈ 1100) influences the effective gravitational interactions and the geometry of the early universe. The model predicts a deficit of 8.8% in the C_ℓ at ℓ=20, which aligns remarkably well with the observed anomaly. This provides a compelling physical explanation for a long-standing puzzle in CMB cosmology.\n" +
                    "These predictions aren’t merely additional fits but emerge organically from the model’s structure, which integrates the BAO features into φ(z). This shifts the “bumps” from being ad-hoc parameters to being crucial components of a predictive physical framework.\n" +
                    "**Robustness and Multi-Probe Consistency:** The model’s overall coherence significantly reinforces the physical justification for the φ(z) bumps. The entire framework, including the specific form of φ(z) with its Gaussian features, is simultaneously calibrated against a diverse suite of high-precision cosmological data using rigorous Markov Chain Monte Carlo (MCMC) methods:\n" +
                    "• Hubble Constant (H₀) Measurements: The model achieves remarkable agreement with local H₀ measurements from SH0ES, reducing the tension from over 5σ in ΛCDM to a mere 0.13σ.\n" +
                    "• Cosmic Chronometers: Excellent fit (χ²/dof = 0.853) to H(z) data, demonstrating the model’s ability to accurately trace the expansion history. The localized correction at z=0.4 significantly improved this fit.\n" +
                    "• Baryon Acoustic Oscillations (BAO): Strong agreement (χ²/dof = 0.700) with DESI DR1 BAO data, directly supported by the inclusion and optimization of the A₁ and A₂ “bumps.”\n" +
                    "• Big Bang Nucleosynthesis (BBN): The model remains highly consistent with primordial element abundances (e.g., Deuterium-to-Hydrogen ratio), ensuring the early universe physics is not disrupted.\n" +
                    "• CMB Angular Scale (θ*): The model accurately predicts the angular size of the sound horizon at decoupling, showing excellent agreement with Planck observations.\n" +
                    "This high level of multi-probe consistency suggests that the chosen form of φ(z), including its characteristic bumps, is not just a statistical artifact but genuinely captures underlying cosmic dynamics required to reconcile various observational constraints.\n" +
                    "**Conclusion and Future Exploration:** The “bumps” in φ(z) are far more than phenomenological adjustments; they are physically motivated features representing the imprints of Baryon Acoustic Oscillations on the dynamic fractal dimension. Their strategic placement at specific redshifts, coupled with their role in achieving multi-probe consistency, solidifies their physical basis. Crucially, these features enable the model to make testable predictions, such as the deficit in galaxy cluster abundance and the explanation for the CMB low-ℓ anomaly. As these predictions are further tested by next-generation astronomical surveys, the physical justification of these “bumps” and, by extension, the dynamic fractal dimension model itself, will become even more robust. Future work will aim to integrate this dynamic fractal dark energy module into sophisticated cosmological codes like CLASS, enabling even more precise predictions and detailed comparisons with observations, potentially unveiling the deeper microphysical origins of these cosmic imprints."
                    },
                  // Ajoutez ce segment après le SEGMENT 10, par exemple.
// Assurez-vous qu'il soit bien intégré dans le tableau `parts` de l'historique utilisateur.

                {text: "**Future of the Universe: Fate of the Cosmos**\n" +
                "The ultimate fate of the Universe within the dynamic fractal cosmological model is primarily determined by the behavior of dark energy, characterized by its equation of state parameter, w. Different values of w lead to distinct end scenarios:\n" +
                "• Big Freeze (Heat Death): If w = -1 (cosmological constant) or w > -1 (quintessence), the expansion accelerates indefinitely, but without reaching an infinite rate in finite time. The Universe becomes cold, dark, and empty.\n" +
                "• Big Rip: If w < -1 (phantom energy), the acceleration of expansion becomes so extreme that the dark energy density increases over time. This leads to the progressive “ripping apart” of structures: galaxy clusters, galaxies, stellar systems, planets, and eventually atoms themselves are torn apart by the accelerating expansion.\n" +
                "**Key Indicator: The Modified Friedmann Equation**\n" +
                "The most fundamental equation in this model describing the Universe’s expansion is the modified Friedmann equation:\n" +
                "H²(z) = H₀²[Ω_m(1+z)^(3φ(z)) + Ω_Λ(1+z)^(3(2-φ(z)))]\n" +
                "This equation directly implies the scaling of dark energy density ρ_Λ(z) ∝ (1+z)^(3(2-φ(z))).\n" +
                "To predict the future, we examine the behavior as time approaches infinity, which corresponds to redshift z → -1.\n" +
                "• Future Evolution of φ(z): The function φ(z) is dominated by the exponential term e^(-Γz) for long-term evolution. As z becomes negative (approaching -1), this exponential term increases significantly:\n" +
                "z → -1 ⇒ e^(-Γz) → e^Γ\n" +
                "With Γ = 0.433, the future value of φ will converge to a constant value higher than its current value.\n" +
                "• Dark Energy Exponent and Phantom Energy:\n" +
                "The dark energy density ρ_Λ is proportional to the term (1+z)^(3(2-φ(z))). Since the scale factor a = 1/(1+z), we can rewrite this as:\n" +
                "ρ_Λ(a) ∝ a^(-3(2-φ(a))) = a^(3(φ(a)-2))\n" +
                "Because φ is and will remain greater than 2 in the future, the exponent 3(φ(a)-2) is positive. This implies that the dark energy density increases as the Universe expands (a → ∞). This behavior is the very definition of phantom energy, characterized by an equation of state w < -1. The model’s dark energy equation of state, w_Λ(z) = 1 - φ(z), is consistent with this behavior, as φ(z) > 2 implies w_Λ(z) < -1. Consequently, based on the modified Friedmann equation, this model unequivocally predicts a Big Rip.\n" +
                "This prediction is a direct and powerful consequence of the evolution of the fractal dimension φ(z) into the future, linking the dynamic fractal geometry of spacetime to the ultimate destiny of the cosmos."
                }

                ],
            },
            {
                role: "model",
                parts: [{text: "Hello! I am the assistant dedicated to the Dynamic Fractal Cosmological Model (DFCM). I'm ready to explain this model to you based on the detailed information I have. Please ask me your questions, and I will do my best to answer accurately and clearly, referring to my internal documentation on DFCM."}],
            },
        ],
        // Make sure the "model" is still correct here
        model: "gemini-2.0-flash",
        // You can adjust generationConfig if you want more control over responses (optional)
        // generationConfig: {
        //     maxOutputTokens: 800, // Increase for longer responses
        //     temperature: 0.5, // Decrease for more factual responses, increase for more creativity
        // },
    });

    // Générer le contenu avec Gemini
    const result = await chat.sendMessage(message); // Utilisez chat.sendMessage ici
    const geminiResponse = await result.response;
    const text = geminiResponse.text();

    // Renvoyer la réponse de l'IA
    response.status(200).json({ reply: text });
  } catch (error) {
    // Gérer les erreurs de l'API Gemini
    console.error("Gemini API error:", error);
    response.status(500).json({ error: 'Failed to get response from Gemini API', details: error.message });
  }
}
