import { useEffect, useState } from 'react';
import { Button, Heading, VStack, Input } from '@chakra-ui/react'
import browser from "webextension-polyfill";

import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://xjspnyouxerhyrahxszg.supabase.co'
const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODQ0ODkwNSwiZXhwIjoxOTU0MDI0OTA1fQ.J5E5yqcloTfAoc-VKvJLQl2KIcoAti-_ROR5U-SNJKo'
const supabase = createClient(supabaseUrl, publicAnonKey)

export function Popup() {
  const [user, setUser] = useState("");
  const [currentUrl, setCurrentUrl] = useState("")

  useEffect(() => {
    browser.storage.local.get("user").then(({ user }) => {
      console.log({user})
      setUser(user)
    })
  }, [])

  useEffect(() => {
    browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
      setCurrentUrl(tabs[0].url ?? "blank")
    })
  }, []);

  if (!user) {
    return (
      <LoginPage />
    )
  }

  return (
    <VStack>
      <Heading>tipstar</Heading>
      <p>You're currenly on: {currentUrl}</p>
      <Button colorScheme='blue'>Support this site</Button>
    </VStack>
  );
};

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function savelogin(user, session) {
    browser.storage.local.set({ user: { user, session } })
  }

  async function login() {
    const { user, session, error } = await supabase.auth.signIn({
      email: email,
      password: password
    })

    console.log({user, session, error})

    if (!error) {
      savelogin(user, session)
    }
  }

  return (
    <VStack p={4}>
      <Heading>tipstar</Heading>
      <p>Login to continue...</p>
      <Input type="email" placeholder="Your Email" variant="outline" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" placeholder="Password here" variant="outline" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={() => login()} colorScheme="blue" w="full">Login</Button>
      <Button variant="outline" w="full">Not a user? Signup</Button>
    </VStack>
  )
}
