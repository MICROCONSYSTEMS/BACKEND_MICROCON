import express from 'express';
import {
    AddAddress,
    DeleteAddress,
    EditAddress,
    GetAllAddressesForUser,
    GetAddressById
} from '../controller/AddressBook/index.js';
import { AuthMiddleware } from '../middleware/AuthMiddleware.js';

const AddressBookRouter = express.Router();
//
AddressBookRouter.post('/add-address', AuthMiddleware, AddAddress);
AddressBookRouter.delete('/delete-address/:id', AuthMiddleware, DeleteAddress);
AddressBookRouter.put('/edit-address/:id', AuthMiddleware, EditAddress);
AddressBookRouter.get('/get-all-addresses/:userId', AuthMiddleware, GetAllAddressesForUser);
AddressBookRouter.get('/get-address-by-id/:id', AuthMiddleware, GetAddressById);

export default AddressBookRouter;