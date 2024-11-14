'use client'

import { useState, useCallback } from 'react'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"


type SearchResult ={id:number,content:string}[]

function parseMarkdown(content: string) {
  const lines = content.split('\n')
  const result = []
  let inCodeBlock = false
  let codeContent = ''
  
  let currentList = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        result.push(
          <pre key={`code-${i}`} className="bg-gray-100 p-2 rounded my-2 font-mono text-sm overflow-x-auto">
            <code>{codeContent}</code>
          </pre>
        )
        inCodeBlock = false
        codeContent = ''
      } else {
        inCodeBlock = true
      }
      continue
    }

    if (inCodeBlock) {
      codeContent += line + '\n'
      continue
    }
    
    if (line.startsWith('# ')) {
      result.push(<h1 key={`h1-${i}`} className="text-2xl font-bold mt-4 mb-2">{line.slice(2)}</h1>)
    } else if (line.startsWith('## ')) {
      result.push(<h2 key={`h2-${i}`} className="text-xl font-semibold mt-3 mb-2">{line.slice(3)}</h2>)
    } else if (line.startsWith('### ')) {
      result.push(<h3 key={`h3-${i}`} className="text-lg font-semibold mt-2 mb-1">{line.slice(4)}</h3>)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!currentList || currentList.type !== 'ul') {
        currentList = { type: 'ul', items: [] as JSX.Element[] }
        result.push(
          <ul key={`ul-${i}`} className="list-disc pl-5 my-2">
            {currentList.items}
          </ul>
        )
      }
      currentList.items.push(<li key={`li-${i}`}>{line.slice(2)}</li>)
    
    }
    //解析[]()
    else if(line.includes('](')){
        const [preText, url] = line.slice(0, line.length).split('](');
        const [preDes,text] = preText.split('[');
        const [newUrl, endDes] = url.split(')');
        result.push(
            <p>
                <span> {preDes}</span>
                <a key={`link-${i}`} href={newUrl} className="text-blue-600 hover:underline">{text}</a>
                <span> {endDes}</span>
            </p>
        )
        
    } 
    // 这个正则表达式 `/^\d+\.\s/` 用于匹配以数字开头，后跟一个点和一个空格的行。
    // 例如，它可以匹配 "1. 这是一个列表项" 或 "2. 这是另一个列表项"。
    // 具体来说：
    // - `^` 表示行的开始。
    // - `\d+` 表示一个或多个数字。
    // - `\.` 表示一个点。
    // - `\s` 表示一个空格。
    else if (/^\d+\.\s/.test(line)) {
      if (!currentList || currentList.type !== 'ol') {
        currentList = { type: 'ol', items: [] }
        result.push(
          <ol key={`ol-${i}`} className="list-decimal pl-5 my-2">
            {currentList.items}
          </ol>
        )
      }
      currentList.items.push(<li key={`li-${i}`}>{line.slice(line.indexOf(' ') + 1)}</li> as JSX.Element)
    } else if (line.startsWith('> ')) {
      result.push(<blockquote key={`quote-${i}`} className="border-l-4 border-gray-300 pl-4 italic my-2">{line.slice(2)}</blockquote>)
    } else if (line === '---') {
      result.push(<hr key={`hr-${i}`} className="my-2" />)
    } else if (line === '') {
      currentList = null
      result.push(<br key={`br-${i}`} />)
    } else {
      const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]$$.*?$$)/)
      const formattedParts = parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={`strong-${i}-${index}`}>{part.slice(2, -2)}</strong>
        } else if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={`em-${i}-${index}`}>{part.slice(1, -1)}</em>
        } else if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={`code-${i}-${index}`} className="bg-gray-100 px-1 rounded">{part.slice(1, -1)}</code>
        } else if (part.startsWith('[') && part.includes('](')) {
          const [text, url] = part.slice(1, -1).split('](')
          return <a key={`link-${i}-${index}`} href={url} className="text-blue-600 hover:underline">{text}</a>
        } else {
          return part
        }
      })
      result.push(<p key={`p-${i}`} className="my-1">{formattedParts}</p>)
    }
  }

  return result
}



export  function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  //如果没给完整的初始值。就需要设置类型了，返回值默认，不需要加
  const [searchResults, setSearchResults] = useState<SearchResult>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Simulate search results (replace with actual API call in a real application)
      const mockResults:SearchResult = [
        { id: 1, content: `# First search result

URL: [https://example.com/1](https://example.com/1)其他内容

This is a description of the first search result. It provides a brief overview of the content.

- Key point 1
- Key point 2
- Key point 3

> Notable quote or excerpt from the page

Here's an example of **bold** and *italic* text, as well as \`inline code\`.

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
greet('World');
\`\`\`` },
        { id: 2, content: `# Second search result

URL: [https://example.com/2](https://example.com/2)

Here is the description for the second result. It gives users an idea of what to expect from this page.

## Subheading

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list item 3

### Sub-subheading

This demonstrates nested headings and mixed content types.

* Unordered list item
* Another unordered item
  * Nested item
  * Another nested item

\`\`\`python
def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)

print(factorial(5))
\`\`\`` },
        { id: 3, content: `# Third search result

URL: [https://example.com/3](https://example.com/3)

The third result description appears here. It should be informative and relevant to the search query.

**Bold text for emphasis**

*Italic text for emphasis*

---

Additional information or details about the search result

Here's a table:

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1    | Data     | More     |
| Row 2    | Info     | Stuff    |

And finally, here's some inline math: \`E = mc^2\`` },
      ] as const
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSearchResults(mockResults)
      setHasSearched(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('An error occurred while searching. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 sm:pt-20 px-4">
      <div className={`w-full max-w-2xl transition-all duration-300 ease-in-out ${hasSearched ? 'mb-8' : 'mb-20'}`}>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="relative flex-grow">
            <Input
              type="search"
              placeholder="Search the web"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
              aria-label="Search input"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <Button type="submit" className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-colors" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>

      {error && (
        <div className="w-full max-w-2xl mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded" role="alert">
          {error}
        </div>
      )}

      {hasSearched && !error && (
        <div className="w-full max-w-2xl">
          <p className="text-sm text-gray-600 mb-4">About {searchResults.length} results</p>
          <ScrollArea className="h-[calc(100vh-150px)] sm:h-[calc(100vh-200px)] rounded-md border p-4">
            {searchResults.map((result) => (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <div key={result.id} className="mb-6">
                {parseMarkdown(result.content)}
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  )
}