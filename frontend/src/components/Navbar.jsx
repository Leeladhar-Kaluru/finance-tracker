function Navbar({ summary }){
    return(
        <header className="topbar fade-in-up">
            <div>
                <p className="topbar__eyebrow">Finance tracker</p>
                <h1>Move money with more clarity.</h1>
                <p className="topbar__copy">
                    Built for income, expenses, and a fast read on the numbers that matter.
                </p>
            </div>

            <div className="topbar__card">
                <span>Live balance</span>
                <strong>
                    {summary.balance.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                    })}
                </strong>
                <small>{summary.transactionCount} transactions tracked</small>
            </div>
        </header>
    );
}

export default Navbar;