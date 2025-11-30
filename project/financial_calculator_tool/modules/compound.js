export function getTemplate() {
    return `
        <div class="calc-container">
            <h2>💰 Compound Interest</h2>
            <div class="form-group">
                <label>Principal ($)</label>
                <input type="number" id="ci-principal" value="1000">
            </div>
            <div class="form-group">
                <label>Rate (%)</label>
                <input type="number" id="ci-rate" value="5">
            </div>
            <div class="form-group">
                <label>Years</label>
                <input type="number" id="ci-years" value="10">
            </div>
            <button class="btn-calc" id="btn-ci">Calculate</button>
            <div class="result-box">
                Future Value: <span class="result-val" id="res-ci">$0.00</span>
            </div>
        </div>
    `;
}

export function init() {
    document.getElementById('btn-ci').addEventListener('click', () => {
        const p = parseFloat(document.getElementById('ci-principal').value);
        const r = parseFloat(document.getElementById('ci-rate').value) / 100;
        const t = parseFloat(document.getElementById('ci-years').value);
        
        // Simple Annual Compound for demo
        const val = p * Math.pow((1 + r), t);
        
        const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
        document.getElementById('res-ci').innerText = formatter.format(val);
    });
}