export function getTemplate() {
    return `
        <div class="calc-container">
            <h2>🎈 Inflation Calculator</h2>
            <p>Calculate what an amount today will be worth in the future.</p>
            <div class="form-group">
                <label>Current Amount ($)</label>
                <input type="number" id="inf-amount" value="1000">
            </div>
            <div class="form-group">
                <label>Inflation Rate (%)</label>
                <input type="number" id="inf-rate" value="3.5">
            </div>
            <div class="form-group">
                <label>Years</label>
                <input type="number" id="inf-years" value="10">
            </div>
            <button class="btn-calc" id="btn-inf">Calculate Future Cost</button>
            <div class="result-box">
                Future Cost: <span class="result-val" id="res-inf">$0.00</span>
            </div>
        </div>
    `;
}

export function init() {
    document.getElementById('btn-inf').addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('inf-amount').value);
        const rate = parseFloat(document.getElementById('inf-rate').value);
        const years = parseFloat(document.getElementById('inf-years').value);

        // Formula: Amount * (1 + rate/100)^years
        const futureValue = amount * Math.pow((1 + rate/100), years);

        const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
        document.getElementById('res-inf').innerText = formatter.format(futureValue);
    });
}