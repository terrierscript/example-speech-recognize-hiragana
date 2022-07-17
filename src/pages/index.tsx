import { Box, Button } from '@chakra-ui/react'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { allHiragana } from '../lib/hiragana'


const HiraganaApp = () => {
  const [ready, setReady] = useState(false)
  const [result, setResult] = useState("")
  const hiras = allHiragana()

  const start = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition
    // @ts-ignore
    const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList
    // @ts-ignore
    const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent

    const hiragram = [
      ...hiras,
      ...hiras.map(c => `${c}ー`),
      ...['かあ', 'きい', 'くう', 'けえ', 'こお'],
      ...['かぁ', 'きぃ', 'くぅ', 'けぇ', 'こぉ'],
    ]
      .map(c => `"${c}"`)
      .join(" | ")
    // const hiragram = "あ"
    const grammar = `#JSGF V1.0 UTF-8 ja; grammar hiraganas; public <hiragana> = [${hiragram}];`
    // const grammar = `#JSGF ;`
    // const grammar = '#JSGF V1.0 JIS ja; grammar numbers; public <numbers> = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100 ;'

    console.log(grammar)
    // var grammar = '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;'
    // @ts-ignore
    const recognition = new SpeechRecognition()
    // @ts-ignore
    const speechRecognitionList = new SpeechGrammarList()
    speechRecognitionList.addFromString(grammar, 1)
    recognition.grammars = speechRecognitionList
    recognition.continuous = false
    recognition.lang = 'ja'
    // recognition.lang = 'en-US'
    recognition.interimResults = true
    // recognition.maxAlternatives = 10
    console.log({ g: recognition.grammars })

    const finalizeRecognition = () => {
      setReady(false)
      recognition.stop()

    }
    recognition.onspeechstart = function (event) {
      console.log({ "start": event })
    }

    recognition.onresult = function (event) {
      const transcript = event.results?.[0]?.[0]?.transcript
      console.log({
        result: event,
        transcript
      })
      setResult(transcript)
      finalizeRecognition()
      // start()
    }

    recognition.onnomatch = function (event) {
      console.log({ nomatch: event })
    }
    recognition.onerror = function (event) {
      console.log({ onerror: event })
      finalizeRecognition()
    }

    // recognition.onsoundstart = function (event) {
    //   console.log({ soundStart: event })
    // }
    // recognition.onsoundend = function (event) {
    //   console.log({ soundend: event })
    // }

    // recognition.onspeechstart = function (event) {
    //   console.log({ onospeechstart: event })
    // }
    // recognition.onspeechend = function (event) {
    //   console.log({ speechEnd: event })
    // }

    recognition.onend = function (event) {
      console.log({ end: event })
      finalizeRecognition()
    }
    // recognition.onaudiostart = function (event) {
    //   console.log({ audiostart: event })
    // }
    // recognition.onaudioend = function (event) {
    //   console.log({ audioend: event })
    // }

    recognition.start()
    setReady(true)
    console.log({ recognition })

  }
  return <Box>
    <Box>{result}</Box>
    {(ready) ?
      <Box>おはなししてね</Box>
      :
      <Button onClick={() => {
        start()
      }}>おしてね</Button>
    }
  </Box>
}
export default function Home() {
  return (
    <Box>
      <Head>
        <title></title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <HiraganaApp />
      </Box>
    </Box>
  )
}
