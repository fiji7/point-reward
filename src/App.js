import { useEffect, useState } from 'react';
import moment from 'moment';
import { TransactionTable } from './components/Table';
import { transactionsData } from './api/api';
import { filterDates, getMonthsBack } from './utils/helpers';


export default function App() {
  const [transactions, setTransactionsData] = useState();
  const [months, setMonths] = useState([]);

  const getTransactions = async () => {
    let tData = await transactionsData;
    const [initialDate, movedDate, monthsInRange] = getMonthsBack(
      moment(new Date(new Date().getFullYear() - 1, 11, 31)).format('l'), //last day of the previous year
      3 // number of months
    );
    setMonths(monthsInRange);
    tData = filterDates(tData, initialDate, movedDate, monthsInRange);
    setTransactionsData(tData);
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <div className='container'>
      <div className='title'><span>Points Per Customer</span></div>
      <div className='table'>{transactions && <TransactionTable transactions={transactions} months={months} />}</div>
    </div>
  );
};
