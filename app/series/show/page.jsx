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
  Select,
  SelectItem,
  Input
} from "@heroui/react";
import { getSeries, deleteSerie, createSerie, modifySerie, getUserSeries }  from "../../services/data"
import Loading from '../../components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons';


function ShowSeries() {
    const { user, isLoading } = useUser();
    const [page, setPage] = React.useState(1);
    const rowsPerPage = 10;
    const data  = []
    const [ id, setId] = useState(0)
    const [ series, setSeries] = useState([])
    const [ userSeries, setUserSeries] = useState([])
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [name, setName] = useState('');
    const [season, setSeason] = useState(0);
    const [episode, setEpisode] = useState(0);
    const modify = useDisclosure();

    useEffect(() => {
        const getItems = async () => {
            if (!isLoading && user) { // Ensure user is loaded
                const itemsData = await getUserSeries(user.nickname);   
                const json = itemsData.json();
                json.then((serie) => {
                    setUserSeries(serie);
                });
                
                const seriesData = await getSeries();
                const jsonSeries = seriesData.json();
                jsonSeries.then((serie) => {
                    setSeries(serie);
                });
            }
        };
        getItems();
    }, [isLoading, user]); 

    const pages = React.useMemo(() => {
        return data?.count ? Math.ceil(data.count / rowsPerPage) : 0;
      }, [data?.count, rowsPerPage]);

    const loadingState = isLoading || data?.results?.length === 0 ? "loading" : "idle";

    const handleDelete = async (id) => {
        const response = await deleteSerie(id)
        if (response.ok) {
            const itemsData = await getUserSeries(user.nickname);
            const updatedserie = await itemsData.json();
            setUserSeries(updatedserie);
        }
    };

    const handleCreate = async (onClose) => {
        const data = {
            'name': Array.from(name)[0],
            'season': season,
            'episode': episode,
            'user': user.name,
            'email': user.nickname
        }
        const response = await createSerie(data)
        if (response.ok) {
            const itemsData = await getUserSeries(user.nickname);
            const updatedserie = await itemsData.json();
            setUserSeries(updatedserie);
        } else {
            console.error("Error creating serie:", response.statusText);
        }
        onClose()
    }

    const handleChange = (event) => {
        if(event.target.name === "season"){
            setSeason(event.target.value);
        }
        else if(event.target.name === "episode"){
            setEpisode(event.target.value);
        }
    }

    const openModify = async (item) => {
        setId(item.id);
        setName(item.name);
        setSeason(item.season);
        setEpisode(item.episode);
        modify.onOpen()
    }

    const handleModify = async (onClose) => {
        const data = {
            'id': id,
            'season': season,
            'episode': episode,
            'email': user.nickname
        }
        const response = await modifySerie(data, id)
        if (response.ok) {
            const itemsData = await getUserSeries(user.nickname);
            const updatedserie = await itemsData.json();
            setUserSeries(updatedserie);
        } else {
            console.error("Error modifying serie:", response.statusText);
        }
        onClose()
    }

    return(
        <>
            {isLoading && <Loading/>}
            {user && (
                <>
                    <div className='grid grid-flow-col grid-rows-3 gap-4'>
                        <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader className='flex flex-col gap-1 text-center'> Add New Serie </ModalHeader>    
                                        <ModalBody className='flex flex-col gap-1'>
                                            <div className="flex flex-col">
                                            <Select
                                                className="max-w-xs"
                                                label="Serie Name"
                                                placeholder="Select a serie"
                                                selectedKeys={name}
                                                variant="underlined"
                                                onSelectionChange={setName}
                                            >
                                                {series.map((serie) => (
                                                <SelectItem key={serie.name}>{serie.name}</SelectItem>
                                                ))}
                                            </Select>
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="season">Season</label>
                                                <input type="number" id="season" name="season" placeholder="Season Number" className="border rounded p-2" required onChange={handleChange}/>
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="episode">Episode</label>
                                                <input type="number" id="episode" name="episode" placeholder="Episode Number" className="border rounded p-2" required onChange={handleChange}/>
                                            </div>
                                            <Button variant="ghost" size="md" onPress={() => handleCreate(onClose)} className="mt-2 mb-2">Add</Button>
                                        </ModalBody>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                        <Modal isOpen={modify.isOpen} placement="center" onOpenChange={modify.onOpenChange}>
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader className='flex flex-col gap-1 text-center'> Add New Serie </ModalHeader>    
                                        <ModalBody className='flex flex-col gap-1'>
                                            <div className="flex flex-col">
                                                <Input label="Serie" type='test' isReadOnly defaultValue={name}/>
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="season">Season</label>
                                                <input defaultValue={season} type="number" id="season" name="season" placeholder="Season Number" className="border rounded p-2" required onChange={handleChange}/>
                                            </div>
                                            <div className="flex flex-col">
                                                <label htmlFor="episode">Episode</label>
                                                <input defaultValue={episode} type="number" id="episode" name="episode" placeholder="Episode Number" className="border rounded p-2" required onChange={handleChange}/>
                                            </div>
                                            <Button variant="ghost" size="md" onPress={() => handleModify(onClose)} className="mt-2 mb-2">Modify</Button>
                                        </ModalBody>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                        <div className="row-span-2 row-start-1"></div>
                        <div className="row-span-2 row-end-4">
                            <div className="bg-white shadow-md rounded md:px-6 md:pt-6 md:pb-6">
                                <Table
                                    className=''
                                    aria-label="serie Table"
                                    topContent={
                                        <div className="flex w-full justify-end">
                                            <Button variant="ghost" size="sm" onPress={onOpen}>
                                                Add Serie
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
                                        <TableColumn key="serie" className="text-center sm:w-5 md:w-10">Name</TableColumn>
                                        <TableColumn key="season" className="text-center sm:w-5 md:w-10">Season</TableColumn>
                                        <TableColumn key="episode" className="text-center sm:w-5 md:w-10">Episode</TableColumn>
                                        <TableColumn key="updated_at" className="text-center sm:w-2 md:w-5">Date Modified</TableColumn>
                                        <TableColumn key="delete" className="text-center sm:w-2 md:w-5">Actions</TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent={"No Series found"}
                                        items={userSeries ?? []}
                                        loadingContent={<Spinner />}
                                        loadingState={loadingState}
                                    >
                                        {(item) => (
                                            <TableRow key={item?.id}>
                                                {(columnKey) => {
                                                    if (columnKey === "delete") {
                                                        return <TableCell className="text-center">
                                                                    <Button isIconOnly variant="light" size="lg" style={{ outline: 'none', boxShadow: 'none' }} onPress={() => openModify(item)}>
                                                                        <FontAwesomeIcon icon={faPenToSquare} style={{color: "#000000"}}></FontAwesomeIcon>
                                                                    </Button>
                                                                    <Button isIconOnly  variant="light" size="lg" style={{ outline: 'none', boxShadow: 'none' }} onPress={() => handleDelete(item.id)}>
                                                                        <FontAwesomeIcon icon={faTrashCan} style={{color: "#ff0000"}}></FontAwesomeIcon>
                                                                    </Button>
                                                                </TableCell>;
                                                    }
                                                    else if(columnKey === "serie") {
                                                        return <TableCell className="text-center">{item[columnKey]?.name}</TableCell>; // Display the name of the serie
                                                    }
                                                    else if(columnKey === "updated_at") {
                                                        return <TableCell className="text-center">{item[columnKey]?.slice(0, 10)}</TableCell>;
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

export default withPageAuthRequired(ShowSeries, {
    onRedirecting: () => <Loading />,
  });
  