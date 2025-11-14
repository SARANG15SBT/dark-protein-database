// js/protein-details.js
async function loadProteinDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const proteinId = urlParams.get('id');
    const container = document.getElementById('proteinDetails');
    
    if (!proteinId) {
        container.innerHTML = '<div class="info-box"><p>Protein ID not specified.</p></div>';
        return;
    }
    
    try {
        const res = await fetch('./data/proteins.json');
        const proteins = await res.json();
        
        const protein = proteins.find(p => p["protein ID"] === proteinId);
        
        if (protein) {
            displayProteinDetails(protein, container);
        } else {
            container.innerHTML = '<div class="info-box"><p>Protein not found.</p></div>';
        }
    } catch (error) {
        console.error('Error loading protein details:', error);
        container.innerHTML = '<div class="info-box"><p>Error loading protein details. Please try again later.</p></div>';
    }
}

function displayProteinDetails(protein, container) {
    const img = protein.image_link ? 
        `<img src="${protein.image_link}" alt="${protein['protein ID']}" style="max-width:300px; margin:20px 0; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);" onerror="this.style.display='none'">` : 
        '';
    
    container.innerHTML = `
        <div style="text-align:center; margin-bottom:30px;">
            <h2>${protein["protein ID"] || "Unnamed Protein"}</h2>
            ${img}
        </div>
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:20px; margin-top:20px;">
            <div class="info-box">
                <h3>Basic Information</h3>
                <p><strong>Protein ID:</strong> ${protein["protein ID"] || "N/A"}</p>
                <p><strong>Organism:</strong> ${protein.organism || "N/A"}</p>
                <p><strong>Gene Type:</strong> ${protein.GeneType || "N/A"}</p>
                <p><strong>Category:</strong> ${protein.category || "N/A"}</p>
            </div>
            
            <div class="info-box">
                <h3>Sequence Data</h3>
                <p><strong>Sequence Length:</strong> ${protein.sequence ? protein.sequence.length + " aa" : "N/A"}</p>
                <p><strong>Molecular Weight:</strong> ${protein.molecular_weight || "N/A"}</p>
                <p><strong>Isoelectric Point:</strong> ${protein.isoelectric_point || "N/A"}</p>
                <p><strong>Stability:</strong> ${protein.stability || "N/A"}</p>
            </div>
            
            <div class="info-box">
                <h3>Expression & Production</h3>
                <p><strong>Expression System:</strong> ${protein.expression_system || "N/A"}</p>
                <p><strong>Solubility:</strong> ${protein.solubility || "N/A"}</p>
                <p><strong>Yield:</strong> ${protein.yield || "N/A"}</p>
                <p><strong>Purification Tag:</strong> ${protein.purification_tag || "N/A"}</p>
            </div>
        </div>
        
        ${protein.description ? `
            <div class="info-box" style="margin-top:20px;">
                <h3>Description</h3>
                <p>${protein.description}</p>
            </div>
        ` : ''}
        
        ${protein.function ? `
            <div class="info-box" style="margin-top:20px;">
                <h3>Function</h3>
                <p>${protein.function}</p>
            </div>
        ` : ''}
        
        ${protein.sequence ? `
            <div class="info-box" style="margin-top:20px;">
                <h3>Protein Sequence</h3>
                <textarea style="width:100%; height:200px; font-family:monospace; padding:15px; border:1px solid #ddd; border-radius:4px; resize:vertical; font-size:0.9em;" readonly>${protein.sequence}</textarea>
                <p style="text-align:center; margin-top:10px; color:#666; font-size:0.9em;">
                    Sequence length: ${protein.sequence.length} amino acids
                </p>
            </div>
        ` : ''}
        
        <div style="text-align:center; margin-top:40px;">
            <button onclick="window.location.href='index.html'" 
                    style="background:#5c6bc0; color:white; border:none; padding:12px 30px; border-radius:4px; cursor:pointer; font-size:1em; margin:0 10px;">
                Back to Search
            </button>
            <button onclick="window.history.back()" 
                    style="background:#78909c; color:white; border:none; padding:12px 30px; border-radius:4px; cursor:pointer; font-size:1em; margin:0 10px;">
                Go Back
            </button>
        </div>
    `;
}

// Load protein details when page loads
document.addEventListener('DOMContentLoaded', loadProteinDetails);