'use client';

import React, { useEffect, useState} from 'react';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
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
import { getListsShop, deleteListShop, getItemsShop, createListShop }  from "../../services/data"
import Loading from '../../components/Loading';
import { useRouter, usePathname, useSearchParams  } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

function ShowList() {
    const { user, isLoading } = useUser();
    const [page, setPage] = React.useState(1);
    const rowsPerPage = 10;
    const data  = []
    const [ list, setList] = useState([])
    const router = useRouter();
    const pathname = usePathname();
    const queries = useSearchParams();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [ allItems, setAllItems] = useState([])
    const [ selectedItem, setSelectedItem] = useState([])

    useEffect(() => {
        const getItems = async () => {
            if (!isLoading && user) { // Ensure user is loaded
                const itemsData = await getListsShop(user.nickname);
                const json = itemsData.json();
                json.then((list) => {
                    setList(list);
                });
            }
        };
        getItems();
    }, [isLoading, user]); 

    const pages = React.useMemo(() => {
        return data?.count ? Math.ceil(data.count / rowsPerPage) : 0;
      }, [data?.count, rowsPerPage]);

    const loadingState = isLoading || data?.results?.length === 0 ? "loading" : "idle";

    const showDetails = (id) => {
        const params = new URLSearchParams(queries.toString());
        params.set("id", id);
        router.push(`${pathname}/details/?${params.toString()}`);
    };

    const handleOpen = async (onOpen) => {
        const itemsData = await getItemsShop();
        const json = itemsData.json()
        json.then((item) => {
            setAllItems(item)
        })
        onOpen();
    }

    const handleCreate = async (onClose) => {
        const data = {
            'items': Array.from(selectedItem),
            'user': user.name,
            'email': user.nickname
        }
        const response = await createListShop(data, selectedItem)
        if (response.ok) {
            const itemsData = await getListsShop(user.nickname);
            const updatedList = await itemsData.json();
            setList(updatedList); // Update the state with the latest data
        }
        onClose()
    }

    const handleDelete = async (id) => {
        const response = await deleteListShop(id)
        console.log(response)
        if (response.ok) {
            const itemsData = await getListsShop(user.nickname);
            const updatedList = await itemsData.json();
            setList(updatedList); // Update the state with the latest data
        }
    };

    return(
        <>
            {isLoading && <Loading/>}
            {user && (
                <>
                    <Modal size="xs" isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className='flex flex-col gap-1 text-center'> Create List </ModalHeader>
                                    <ModalBody className='flex flex-col gap-1'>
                                        <div className='flex flex-col'>
                                            <Dropdown>
                                                <DropdownTrigger className='mb-3 mx-[2rem]'>
                                                    <Button className="capitalize" variant="bordered">
                                                        ShopList
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu
                                                    disallowEmptySelection
                                                    aria-label="Multiple selection example"
                                                    closeOnSelect={false}
                                                    selectedKeys={selectedItem}
                                                    selectionMode="multiple"
                                                    variant="flat"
                                                    onSelectionChange={setSelectedItem}
                                                    items={allItems}
                                                >
                                                    {(item) => (
                                                        <DropdownItem key={item.name} color="default">
                                                            {item.name}
                                                        </DropdownItem>
                                                    )}
                                                </DropdownMenu>
                                            </Dropdown>
                                            <Button className='mx-[6rem]' onPress={() => handleCreate(onClose)} color="primary">Create</Button>
                                        </div>
                                    </ModalBody>
                                    
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                    <div className='grid grid-flow-col grid-rows-3 gap-4'>
                        <div className="row-span-2 row-start-1"></div>
                        <div className="row-span-2 row-end-4">
                            <div className="bg-white shadow-md rounded md:px-6 md:pt-6 md:pb-6">
                                <Table
                                    className=''
                                    aria-label="List Table"
                                    topContent={
                                        <div className="flex w-full justify-end">
                                            <Button variant="ghost" size="md" onPress={() => handleOpen(onOpen)}>
                                                Create New List
                                            </Button>
                                        </div>
                                    }
                                    bottomContent={
                                        pages > 0 ? (
                                        <div className="flex w-full justify-center">
                                            <Pagination
                                            isCompact
                                            showControls
                                            showShadow
                                            color="primary"
                                            page={page}
                                            total={pages}
                                            onChange={(page) => setPage(page)}
                                            />
                                        </div>
                                        ) : null
                                    }
                                    >
                                    <TableHeader className="text-center">
                                        <TableColumn key="item" className="text-center sm:w-5 md:w-10"># of Items</TableColumn>
                                        <TableColumn key="date" className="text-center sm:w-20 md:w-20 ">Date Modified</TableColumn>
                                        <TableColumn key="delete" className="text-center sm:w-2 md:w-5">Actions</TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent={"No list found"}
                                        items={list ?? []}
                                        loadingContent={<Spinner />}
                                        loadingState={loadingState}
                                    >
                                        {(item) => (
                                            <TableRow key={item?.id} onClick={() => showDetails(item.id)}>
                                                {(columnKey) => {
                                                    if (columnKey === "item") {
                                                        return <TableCell className="text-center">{item[columnKey]?.length}</TableCell>; // Display the number of items
                                                    }
                                                    else if (columnKey === "delete") {
                                                        return <TableCell className="text-center">
                                                                    <Button isIconOnly  variant="light" size="lg" style={{ outline: 'none', boxShadow: 'none' }} onPress={() => handleDelete(item.id)}>
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
}

export default withPageAuthRequired(ShowList, {
    onRedirecting: () => <Loading />,
  });
  