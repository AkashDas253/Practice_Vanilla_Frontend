export function getTemplate() {
    return `
        <div class="calc-container">
            <h2>📈 ROI Calculator</h2>
            <div class="form-group">
                <label>Amount Invested ($)</label>
                <input type="number" id="roi-invested" value="5000">
            </div>
            <div class="form-group">
                <label>Amount Returned ($)</label>
                <input type="number" id="roi-returned" value="6500">
            </div>
            <button class="btn-calc" id="btn-roi">Calculate ROI</button>
            <div class="result-box">
                ROI: <span class="result-val" id="res-roi">0.00%</span>
            </div>
        </div>
    `;
}

export function init() {
    document.getElementById('btn-roi').addEventListener('click', () => {
        const invested = parseFloat(document.getElementById('roi-invested').value);
        const returned = parseFloat(document.getElementById('roi-returned').value);

        if(!invested) return;

        // Formula: ((Returned - Invested) / Invested) * 100
        const roi = ((returned - invested) / invested) * 100;

        document.getElementById('res-roi').innerText = roi.toFixed(2) + '%';
        
        // Change color based on profit/loss
        document.getElementById('res-roi').style.color = roi >= 0 ? '#27ae60' : '#c0392b';
    });
}