"use client"
import { Text } from "@chakra-ui/react"
import { useToast } from "@chakra-ui/react"
import { Grid, GridItem } from "@chakra-ui/react"
import { Container } from "@chakra-ui/react"
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react"
import { Heading } from "@chakra-ui/react"
import { Button, ButtonGroup } from "@chakra-ui/react"
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react"
import { Flex, Spacer } from "@chakra-ui/react"
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react"
import { Divider } from "@chakra-ui/react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import { Input } from "@chakra-ui/react"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { Textarea } from "@chakra-ui/react"
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react"

export default function Page() {
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure()
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()
  const [currentNotes, setCurrentNotes] = useState([])
  const [currentId, setCurrentId] = useState("")
  const [currentTitle, setCurrentTitle] = useState("")
  const [currentBody, setCurrentBody] = useState("")
  const [currentCreatedAt, setCurrentCreatedAt] = useState("")
  const cancelRef = useRef()
  const toast = useToast()

  const res = async () => {
    const response = await axios.get(`http://localhost:4000/note`)
    setCurrentNotes(response.data.data)
  }

  const saveNote = async () => {
    if (currentId === "") {
      const response = await axios
        .post(`http://localhost:4000/note`, {
          title: currentTitle,
          body: currentBody,
        })
        .then((response) => {
          res()
          onModalClose(true)
          toast({
            title: "Note added.",
            status: "success",
            duration: 3000,
            isClosable: true,
          })
        })
        .catch((error) => {
          console.log(error)
          toast({
            title: error.response.data.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          })
        })
    } else {
      const response = await axios
        .put(`http://localhost:4000/note/${currentId}`, {
          title: currentTitle,
          body: currentBody,
        })
        .then((response) => {
          res()
          onModalClose(true)
          toast({
            title: "Note updated.",
            status: "success",
            duration: 3000,
            isClosable: true,
          })
        })
        .catch((error) => {
          toast({
            title: error.response.data.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          })
        })
    }
  }

  const deleteNote = async (id) => {
    const response = await axios
      .delete(`http://localhost:4000/note/${id}`)
      .then((response) => {
        res()
        toast({
          title: "Note deleted.",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      })
      .catch((error) => {
        toast({
          title: error.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      })
  }

  useEffect(() => {
    res()
  }, [])

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={onModalClose}
        isCentered
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <FormControl>
            <ModalHeader>
              <Input
                size={"lg"}
                fontSize={"1.8rem"}
                fontWeight={"bold"}
                variant="unstyled"
                placeholder="Title"
                value={currentTitle}
                onChange={(e) => {
                  setCurrentTitle(e.target.value)
                }}
              />
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {currentId !== "" && (
                <Text
                  mb={4}
                  opacity={"70%"}
                >
                  Created at: {currentCreatedAt}
                </Text>
              )}

              <Divider />
              <Textarea
                autoFocus
                variant={currentId == "" ? "outline" : "unstyled"}
                placeholder="Write here"
                value={currentBody}
                onChange={(e) => {
                  setCurrentBody(e.target.value)
                }}
                size="lg"
              />
            </ModalBody>
          </FormControl>
          <ModalFooter>
            <Button
              colorScheme="gray"
              mr={3}
              onClick={onModalClose}
            >
              {currentId == "" ? "Cancel" : "Close"}
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => saveNote()}
            >
              {currentId == "" ? "Save" : "Save Changes"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
            >
              Delete Note
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onAlertClose}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  deleteNote(currentId)
                  onAlertClose(true)
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Container maxW="container.lg">
        <Flex py={8}>
          <Heading>My Notes</Heading>
          <Spacer />
          <Button
            size="lg"
            colorScheme="blue"
            onClick={() => {
              setCurrentId("")
              setCurrentTitle("")
              setCurrentBody("")
              setCurrentCreatedAt("")
              onModalOpen(true)
            }}
          >
            <AddIcon me={2} />
            Add note
          </Button>
        </Flex>

        {currentNotes.length > 0 ? (
          <Grid
            templateColumns={[null, "repeat(2, 1fr)", "repeat(3, 1fr)"]}
            gap={6}
          >
            {currentNotes.map((note) => {
              const dateString = `${note.createdAt}`
              const date = new Date(dateString)
              const localDateString = date.toLocaleDateString("id-ID")

              return (
                <Card
                  border="1px"
                  borderColor="gray.200"
                  key={note.id}
                  id={note.id}
                >
                  <CardHeader>
                    <Heading
                      size="md"
                      mb={2}
                    >
                      {note.title}
                    </Heading>
                    <Text opacity={"60%"}>{localDateString}</Text>
                  </CardHeader>
                  <CardBody>
                    <Text noOfLines={3}>{note.body}</Text>
                  </CardBody>
                  <CardFooter>
                    <Flex w="100%">
                      <Button
                        variant="outline"
                        me={1}
                        flex={"1"}
                        size={"sm"}
                        colorScheme={"gray"}
                        onClick={() => {
                          setCurrentId(note.id)
                          setCurrentTitle(note.title)
                          setCurrentBody(note.body)
                          setCurrentCreatedAt(localDateString)
                          onModalOpen(true)
                        }}
                      >
                        Detail
                      </Button>
                      <Button
                        size={"sm"}
                        colorScheme={"red"}
                        onClick={() => {
                          setCurrentId(note.id)
                          onAlertOpen(true)
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </Flex>
                  </CardFooter>
                </Card>
              )
            })}
          </Grid>
        ) : (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Note is Empty!</AlertTitle>
            <AlertDescription>
              Try to make one by clicking the "Add Button" above
            </AlertDescription>
          </Alert>
        )}
      </Container>
    </>
  )
}
