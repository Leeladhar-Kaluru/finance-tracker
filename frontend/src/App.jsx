import {useState , useEffect } from "react";
import { getTransactions } from './services/transactionService';
import Navbar from './components/Navbar';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';

function App(){
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async ()=>{
    try{
      const data = await getTransactions();
      setTransactions(data);
    }
    catch(err){
      console.log("Error fetching transactions:", err);
    }
}

  useEffect(()=>{
    fetchTransactions();
  }, []);

  return(
    <div>
      <Navbar />
      <TransactionForm fetchTransactions={fetchTransactions} />
      <TransactionList transactions={transactions} />
    </div>
  )
}

export default App;