// js/script.js
const jsonDataUrl = "https://raw.githubusercontent.com/YOUR_USERNAME/dark-protein-database/main/data/proteins.json";
let proteinData = [];

// Load data from JSON file
async function loadProteinData() {
  try {
    const res = await fetch(jsonDataUrl);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    proteinData = await res.json();
    console.log("✅ Loaded", proteinData.length, "proteins from JSON");
    
    // Initialize carousel after data loads
    initializeCarousel();
  } catch (error) {
    console.error("❌ Error loading protein data:", error);
    document.getElementById('resultsContainer').innerHTML = 
      "<p style='text-align:center; color: red;'>Error loading protein data. Please try again later.</p>";
  }
}

// Search/filter function
function searchProteins() {
  const org = document.getElementById("organismSelect").value.toLowerCase();
  const gene = document.getElementById("geneTypeSelect").value.toLowerCase();
  const keyword = document.getElementById("keywordInput").value.toLowerCase();
  const container = document.getElementById("resultsContainer");

  // If data hasn't loaded yet
  if (!proteinData || proteinData.length === 0) {
    container.innerHTML = "<p style='text-align:center;'>Loading data...</p>";
    setTimeout(searchProteins, 500); // Retry after delay
    return;
  }

  const results = proteinData.filter(p => {
    return (!org || (p.organism && p.organism.toLowerCase().includes(org))) &&
           (!gene || (p.GeneType && p.GeneType.toLowerCase().includes(gene))) &&
           (!keyword || 
            (p["protein ID"] && p["protein ID"].toLowerCase().includes(keyword)) ||
            (p.organism && p.organism.toLowerCase().includes(keyword)) ||
            (p.GeneType && p.GeneType.toLowerCase().includes(keyword)) ||
            (p.description && p.description.toLowerCase().includes(keyword))
           );
  });

  displayResults(results, container);
}

function displayResults(results, container) {
  if (!results.length) {
    container.innerHTML = "<p style='text-align:center;'>No matching proteins found.</p>";
    return;
  }

  let html = "<div style='display:flex; flex-wrap:wrap; gap:20px; justify-content:center;'>";
  results.forEach(p => {
    const img = p.image_link ? 
      `<img src='${p.image_link}' alt='${p["protein ID"]}' style='width:100%;height:150px;object-fit:cover;border-radius:6px 6px 0 0;' onerror="this.style.display='none'">` : 
      "<div style='width:100%;height:150px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;border-radius:6px 6px 0 0;'>No Image</div>";
    
    html += `
      <div class="protein-card" style="width:280px; background:#fff; border-radius:6px; box-shadow:0 2px 8px rgba(0,0,0,0.1); overflow:hidden; text-align:center;">
        ${img}
        <div style="padding:15px;">
          <h4>${p["protein ID"] || "Unnamed Protein"}</h4>
          <p><b>Organism:</b> ${p.organism || "N/A"}</p>
          <p><b>Gene Type:</b> ${p.GeneType || "N/A"}</p>
          <button onclick="viewDetails('${p["protein ID"]}')"
                  style="background:#5c6bc0;color:white;border:none;border-radius:4px;padding:8px 12px;cursor:pointer;margin-top:10px;">
            View Details
          </button>
        </div>
      </div>`;
  });
  html += "</div>";
  container.innerHTML = html;
}

function viewDetails(proteinId) {
  window.location.href = `protein.html?id=${encodeURIComponent(proteinId)}`;
}

// Carousel functionality
function initializeCarousel() {
  if (!proteinData.length) return;
  
  const featuredProteins = proteinData.slice(0, 6); // Get first 6 proteins for carousel
  const carouselWrapper = document.getElementById('carouselWrapper');
  
  if (!carouselWrapper) return;
  
  let carouselHTML = '';
  featuredProteins.forEach(protein => {
    const img = protein.image_link ? 
      `<img src="${protein.image_link}" alt="${protein['protein ID']}" onerror="this.style.display='none'">` : 
      '<div style="height:150px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;">No Image</div>';
    
    carouselHTML += `
      <div class="protein-card">
        ${img}
        <h4>${protein['protein ID'] || 'Unnamed Protein'}</h4>
        <p>${protein.organism || 'N/A'} - ${protein.GeneType || 'N/A'}</p>
      </div>`;
  });
  
  carouselWrapper.innerHTML = carouselHTML;
}

let currentSlide = 0;
function nextSlide() {
  const wrapper = document.getElementById('carouselWrapper');
  if (!wrapper) return;
  
  const cards = document.querySelectorAll('.protein-card');
  if (cards.length === 0) return;
  
  currentSlide = (currentSlide + 1) % cards.length;
  updateCarousel();
}

function prevSlide() {
  const wrapper = document.getElementById('carouselWrapper');
  if (!wrapper) return;
  
  const cards = document.querySelectorAll('.protein-card');
  if (cards.length === 0) return;
  
  currentSlide = (currentSlide - 1 + cards.length) % cards.length;
  updateCarousel();
}

function updateCarousel() {
  const wrapper = document.getElementById('carouselWrapper');
  if (!wrapper) return;
  
  const cardWidth = 270; // 250px width + 20px margin
  wrapper.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadProteinData();
});