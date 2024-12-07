import { ResBorrowData, ResBorrow } from '@/app/interfaces/borrow';
import { ResItemsGroup } from '@/app/interfaces/item';
import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 * 5 }); // กําหนดเวลาหมดอายุของ cache เป็น 1 วัน (60 = 1 minute, 60 * 60 = 1 hour, 60 * 60 * 24 = 1 day) 
export const GetItemWithCache = async (): Promise<ResItemsGroup[]> => {
    const cachedData = cache.get<ResItemsGroup[]>('items'); // ดึงข้อมูลจาก cache โดยใช้ชื่อ 'items'
    if (cachedData) {
        console.log('Serving from cache');
        return cachedData;
    }

    console.log('Fetching new items data');
    try {
        console.log("hello")
        const response = await axios.get<ResItemsGroup[]>(process.env.NEXT_PUBLIC_BASE_PATH + '/api/items');
        const fetchItems = response.data;

        cache.set('items', fetchItems);
        return fetchItems;
    } catch (error) {
        console.error('Error fetching items:', error);
        return [];
    }
}

export const ClearItemCache = () => cache.del('items');
//cache.flushAll()

export const GetBorrowWithCache = async (): Promise<ResBorrowData[]> => {
    const cachedData = cache.get<ResBorrowData[]>('borrows'); // ดึงข้อมูลจาก cache โดยใช้ชื่อ 'items'
    if (cachedData) {
        console.log('Serving borrows from cache');
        return cachedData;
    }

    console.log('Fetching new borrows data');
    try {
        const res = await axios.get<ResBorrow>(process.env.NEXT_PUBLIC_BASE_PATH + '/api/borrow');
        const fetchBorrows = res.data.data;

        cache.set('borrows', fetchBorrows);
        return fetchBorrows;
    } catch (err) {
        console.error('Error fetching borrows:', err);
        return [];
    }
}

export const ClearBorrowCache = () => cache.del('borrows');
