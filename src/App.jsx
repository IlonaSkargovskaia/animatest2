import React, { useState, useEffect } from "react";
import "./App.css";
import DataSourceEndpoint from "./DataSourceEndpoint";

function App() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dataItems, setDataItems] = useState([]);
    const [sliderPosition, setSliderPosition] = useState(0);
    const [nextItems, setNextItems] = useState([]);
    
    const dataSource = new DataSourceEndpoint();

    useEffect(() => {
        async function fetchData() {
            const initialDataItems = await dataSource.getNextDataItems(10);
            setDataItems(initialDataItems);
            setCurrentIndex(0);

            const nextItems = initialDataItems.slice(1, 6);
            setNextItems(nextItems);
        }
        fetchData();
    }, []);

    useEffect(() => {
        const newPosition = -currentIndex * (600 + 10);
        setSliderPosition(newPosition);
    }, [currentIndex]);

    const handlePrevious = async () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            const prevItemsSlice = dataItems.slice(prevIndex + 1, prevIndex + 6);
    
            if (prevItemsSlice.length < 5) {
                const cachedItems = await dataSource.retrieveFromIndexedDB();
                if (cachedItems.length > 0) {
                    const startIndex = cachedItems.length - (5 - prevItemsSlice.length);
                    const additionalCachedItems = cachedItems.slice(startIndex, cachedItems.length);
                    const newItems = [...additionalCachedItems, ...prevItemsSlice];
                    const excessItems = newItems.slice(0, newItems.length - 10); 
                    await dataSource.saveToIndexedDB(excessItems); 
                    setDataItems(newItems.slice(excessItems.length)); 
                    setCurrentIndex(prevIndex);
                    return;
                }
            }
    
            setNextItems(prevItemsSlice);
            setCurrentIndex(prevIndex);
        }
    };
    
    

    const handleNext = async () => {
        const nextIndex = currentIndex + 1;

        if (nextIndex >= dataItems.length - 6) {
            const newItems = await dataSource.getNextDataItems(5);
            setDataItems((prevItems) => [...prevItems, ...newItems]);
        }

        let updatedNextItems = dataItems.slice(nextIndex + 1, nextIndex + 6);
        if (updatedNextItems.length < 5) {
            const additionalItems = await dataSource.getNextDataItems(
                5 - updatedNextItems.length
            );
            updatedNextItems = [...updatedNextItems, ...additionalItems];
        }
        setNextItems(updatedNextItems);

        setCurrentIndex(nextIndex);

        console.log("Data =>", dataItems);
    };

    return (
        <div className="slider-wrapper">
            <div className="slider-container">
                <div
                    className="slider-box"
                    style={{ transform: `translateX(${sliderPosition}px)` }}
                >
                    {dataItems.map((item, index) => (
                        <div
                            key={index}
                            className={`slide ${
                                currentIndex === index ? "active" : ""
                            }`}
                        >
                            <img src={item.url} alt={`Pic ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="next-items-container">
                {nextItems.map((item, index) => (
                    <div key={index} className="next-item">
                        <img src={item.url} alt={`Next Pic ${index + 1}`} />
                    </div>
                ))}
            </div>
            <button
                className="prev"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
            >
                Prev
            </button>
            <button className="next" onClick={handleNext}>
                Next
            </button>
        </div>
    );
}

export default App;
