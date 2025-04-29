'use client'

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getItemsList, getItemsShop, putItemShopList } from '../../../services/data';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { 
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spinner, 
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem
} from "@heroui/react";
import Loading from '../../../components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeftLong, faTrashCan } from '@fortawesome/free-solid-svg-icons';

function ItemsPage() {
    const [items, setItems] = useState([]);
    const router = useRouter();
    const searchParams = useSearchParams()
    const listId = searchParams.get('id'); // Get listId from the URL parameters
    const { user, isLoading } = useUser();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [ newItems, setNewItems] = useState([])
    const [ allItems, setAllItems] = useState([])

    useEffect(() => {
        const fetchItems = async () => {
            if (!isLoading && user) { // Ensure user is loaded
                const data = await getItemsList(listId);
                const json = data.json();
                json.then((list) => {
                    setItems(list.item); // Assuming the API returns an object with an 'items' property
                });
            };
            
        }
        fetchItems();
    }, [isLoading, user]);

    const handleDelete = async (name) => {
        const data = {
            'item': name,
            'instruction': 'remove'
        }
        const response = await putItemShopList(data, listId);
        if (response.ok) {
            const updatedItemsData = await getItemsList(listId);
            const updatedItems = updatedItemsData.json();
            updatedItems.then((list) => {
                setItems(list.item);
            });
        } else {
            console.error('Error deleting item:', response.statusText);
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    const handleOpen = async () => {
        const itemsData = await getItemsShop();
        const json = itemsData.json()
        json.then((item) => {
            setAllItems(item)
        })
        onOpen();
    }

    const handleMakeChanges = async (onClose) => {
        let previousItems = []
        items.forEach(item => {
            previousItems.push(item.name)
        });
        const itemsConcat = previousItems.concat(Array.from(newItems));
        const distinctItems = [...new Set(itemsConcat)];
        const data = {
            'listId': listId,
            'item': distinctItems,
            'instruction': 'add',
            'email': user.nickname
        };
        const response = await putItemShopList(data, listId);
        if (response.ok) {
            const updatedItemsData = await getItemsList(listId);
            const updatedItems = updatedItemsData.json();
            updatedItems.then((list) => {
                setItems(list.item);
            });
        } else {
            console.error('Error updating items:', response.statusText);
        }
        setNewItems([]);
        onClose();

    };

    return (
        <>
            {isLoading && <Loading/>}
            {user && (
                <>
                    <div className='grid grid-flow-col grid-rows-3 gap-4'>
                        <Modal isOpen={isOpen} size='xs' placement='center' onOpenChange={onOpenChange}>
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader className='flex flex-col gap-1 text-center'> Add new Items </ModalHeader>
                                        <ModalBody className='flex flex-col gap-1'>
                                            <div className='flex flex-col gap-1'>
                                                <Dropdown>
                                                    <DropdownTrigger className='mb-2 ml-[2rem] mr-[2rem]' >
                                                        <Button size="md" className="capitalize" variant="bordered">
                                                            Select Items
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu
                                                        disallowEmptySelection
                                                        aria-label="Multiple selection"
                                                        closeOnSelect={false}
                                                        selectedKeys={newItems}
                                                        selectionMode="multiple"
                                                        variant="flat"
                                                        onSelectionChange={setNewItems}
                                                        items={allItems}
                                                    >
                                                        {(item) => (
                                                            <DropdownItem
                                                                key={item.name}
                                                                color="default"
                                                            >
                                                                {item.name}
                                                            </DropdownItem>
                                                        )}
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                            <div className='flex flex-col'>
                                                <Button variant="ghost" size='md' onPress={() => handleMakeChanges(onClose)} className='mt-2 mb-2 ml-[2rem] mr-[2rem]'> Add </Button>
                                            </div>
                                        </ModalBody>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                        <div className="row-span-2 row-start-1"></div>
                        <div className="row-span-2 row-end-4">
                            <div className="bg-white shadow-md rounded px-6 pt-6 pb-6">
                                    <Table
                                        aria-label="List Items Table"
                                        topContent={
                                            <div className="flex w-full justify-between">
                                                <Button isIconOnly  variant="light" size="lg" style={{ outline: 'none', boxShadow: 'none' }} onPress={() => handleGoBack()}>
                                                    <FontAwesomeIcon icon={faLeftLong}></FontAwesomeIcon>
                                                </Button>
                                                <Button variant="contained" color="primary" onPress={handleOpen} style={{ marginLeft: '10px' }}>
                                                    Make Changes
                                                </Button>
                                            </div>
                                        }
                                    >
                                        <TableHeader>
                                                <TableColumn key="name" className="text-center">Name</TableColumn>
                                                <TableColumn key="marketName" className="text-center">Market Name</TableColumn>
                                                <TableColumn key="delete" className="text-center">Actions</TableColumn>
                                        </TableHeader>
                                        <TableBody emptyContent={"No items found"}
                                            items={items ?? []}
                                            loadingContent={<Spinner />}>
                                            {(item) => (
                                                <TableRow key={item?.id}>
                                                    {(columnKey) => {
                                                        if (columnKey === "delete") {
                                                            return <TableCell className="text-center">
                                                                        <Button variant="contained" color="secondary" onPress={() => handleDelete(item.name)}>
                                                                            <FontAwesomeIcon icon={faTrashCan} style={{color: "#ff0000"}}></FontAwesomeIcon>
                                                                        </Button>
                                                                    </TableCell>;
                                                        }
                                                        return <TableCell className="text-center">{item[columnKey]}</TableCell>;
                                                    }}
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                            </div>
                        </div>
                        <div className="row-start-1 row-end-3"></div>
                    </div>
                </>
            )}
        </>
    );
};

export default withPageAuthRequired(ItemsPage, {
    onRedirecting: () => <Loading />,
  });
