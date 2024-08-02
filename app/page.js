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
    <main className="bg-sky-100 flex min-h-screen flex-col items-center justify-between p-4 font-sans">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm">
        <h1 className="text-4xl p-4 text-center text-sky-900">Pocket Wallet Tracker</h1>
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <form className="grid grid-cols-6 gap-2 items-center">
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="col-span-3 p-3 border border-gray-300 rounded"
              type="text"
              placeholder="Item Name"
            />
            <input
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className="col-span-2 p-3 border border-gray-300 rounded"
              type="number"
              placeholder="Price $"
            />
            <button
              onClick={addItem}
              className="bg-sky-500 hover:bg-sky-600 text-white p-3 rounded col-span-1"
              type="submit"
            >
              Add
            </button>
          </form>
          <ul className="mt-4">
            {items.map((item) => (
              <li key={item.id} className="my-2 p-4 bg-white shadow-md rounded flex justify-between items-center">
                <span className="capitalize">{item.name}</span>
                <span>${item.price}</span>
                <button
                  onClick={() => deleteItems(item.id)}
                  className="ml-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          {items.length > 0 && (
            <div className="flex justify-between p-3 mt-4 bg-white shadow-lg rounded">
              <span className="font-bold">Total</span>
              <span className="font-bold">${total.toFixed(2)}</span> {/* Display total with two decimal places */}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
