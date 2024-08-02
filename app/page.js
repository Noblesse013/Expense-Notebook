'use client';
import React, { useState, useEffect } from "react";
import { collection, addDoc, query, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [total, setTotal] = useState(0);

  // Add items to database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.price !== '') {
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        price: parseFloat(newItem.price), // Ensure the price is a number
      });
      setNewItem({ name: '', price: '' });
    }
  };

  // Read items from database
  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let itemArr = [];
      querySnapshot.forEach((doc) => {
        itemArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemArr);
    });

    return () => unsub(); // Cleanup the subscription on component unmount
  }, []);

  // Calculate total whenever items change
  useEffect(() => {
    const calculateTotal = () => {
      const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.price), 0);
      setTotal(totalPrice);
    };

    calculateTotal();
  }, [items]);

  // Delete items from database
  const deleteItems = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  };

  return (
    <main className="bg-black text-white flex min-h-screen flex-col items-center justify-between p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 text-center text-pink-400">Pocket Wallet Tracker</h1>
        <div className="bg-gray-800 p-4 rounded-lg">
          <form className="grid grid-cols-6 gap-2 items-center">
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="col-span-3 p-3 border border-pink-300 text-pink-300 bg-black"
              type="text"
              placeholder="Enter Item"
            />
            <input
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className="col-span-2 p-3 border border-pink-300 text-pink-300 bg-black"
              type="number"
              placeholder="Enter Tk"
            />
            <button
              onClick={addItem}
              className="text-white bg-pink-600 hover:bg-pink-700 p-3 text-xl rounded"
              type="submit"
            >
              Add
            </button>
          </form>
          <ul>
            {items.map((item) => (
              <li key={item.id} className="my-4 w-full flex justify-between bg-gray-900">
                <div className="p-4 w-full flex justify-between text-pink-300">
                  <span className="capitalize">{item.name}</span>
                  <span>{item.price} Tk</span>
                </div>
                <button onClick={() => deleteItems(item.id)} className="ml-8 p-4 border-l-2 border-pink-300 hover:bg-gray-700 text-pink-300 w-16 rounded">X</button>
              </li>
            ))}
          </ul>
          {items.length < 1 ? '' : (
            <div className="flex justify-between p-3 bg-gray-800 text-pink-300 rounded">
              <span>Total</span>
              <span>${total.toFixed(2)}</span> {/* Display total with two decimal places */}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
