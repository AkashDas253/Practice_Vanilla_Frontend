export function getTemplate() {
    return `
        <div class="calc-container">
            <h2>🏠 Loan Amortization</h2>
            <div class="form-group">
                <label>Loan Amount ($)</label>
                <input type="number" id="la-amount" value="200000">
            </div>
            <div class="form-group">
                <label>Interest Rate (%)</label>
                <input type="number" id="la-rate" value="4.5">
            </div>
            <div class="form-group">
                <label>Loan Term (Years)</label>
                <input type="number" id="la-years" value="30">
            </div>
            <button class="btn-calc" id="btn-la">Calculate Payment</button>
            <div class="result-box">
                Monthly Payment: <span class="result-val" id="res-la">$0.00</span>
            </div>
        </div>
    `;
}

export function init() {
    document.getElementById('btn-la').addEventListener('click', () => {
        const p = parseFloat(document.getElementById('la-amount').value);
        const r = (parseFloat(document.getElementById('la-rate').value) / 100) / 12;
        const n = parseFloat(document.getElementById('la-years').value) * 12;

        // M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
        const x = Math.pow(1 + r, n);
        const monthly = (p * x * r) / (x - 1);

        const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
        document.getElementById('res-la').innerText = formatter.format(monthly);
    });
}