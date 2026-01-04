
document.addEventListener("DOMContentLoaded", () => {
    const keywordInput = document.getElementById("keyword");
    const typeSelect = document.getElementById("ptype");
    const locationSelect = document.getElementById("plocation");
    const clearBtn = document.getElementById("clear-filters");

    const resultsBox = document.getElementById("filter-results");
    const resultsGrid = document.getElementById("results-grid");
    const allProps = Array.from(document.querySelectorAll("#properties-grid .property-card"));

    function normalize(str){
        return str.toLowerCase()
        .replace(/&/g,"")
        .replace(/-/g," ")
        .replace(/[^a-z0-9 ]/g,"")
        .replace(/\s+/g," ")
        .trim();
    }

    function keywordMatch(key, title){
        if(!key) return true;
        let k = normalize(key);
        let t = normalize(title);

        let words = k.split(" ").filter(w => w.length>0);
        if(words.length===0) return true;

        let essential = words.slice(0,2);
        for(let w of essential){
            if(!t.includes(w)) return false;
        }
        return true;
    }

    function filterProperties(){
        let key = keywordInput.value.trim();
        let type = typeSelect.value.trim().toLowerCase();
        let loc = locationSelect.value.trim().toLowerCase();

        let isActive = key || type || loc;
        if(!isActive){
            resultsBox.style.display = "none";
            resultsGrid.innerHTML = "";
            return;
        }

        let matches = [];

        allProps.forEach(card => {
            let title = card.dataset.title || "";
            let ptype = (card.dataset.type || "").toLowerCase();
            let ploc = (card.dataset.location || "").toLowerCase();

            let okKeyword = keywordMatch(key, title);
            let okType = type ? ptype===type : true;
            let okLoc  = loc ? ploc===loc : true;

            if(okKeyword && okType && okLoc){
                matches.push(card);
            }
        });

        resultsGrid.innerHTML = "";
        if(matches.length===0){
            resultsGrid.innerHTML = `<div class="no-results">No matching properties found</div>`;
        } else {
            matches.forEach(c=>{
                resultsGrid.append(c.cloneNode(true));
            });
        }

        resultsBox.style.display = "block";
    }

    keywordInput.addEventListener("input", filterProperties);
    typeSelect.addEventListener("change", filterProperties);
    locationSelect.addEventListener("change", filterProperties);

    clearBtn.addEventListener("click", ()=>{
        keywordInput.value="";
        typeSelect.value="";
        locationSelect.value="";
        resultsGrid.innerHTML="";
        resultsBox.style.display="none";
    });
});
