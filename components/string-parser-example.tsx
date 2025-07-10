import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { 
  parseJsonString, 
  parseCSV, 
  parseUrlParams, 
  parseNumberString,
  parseBooleanString,
  parseDateString 
} from '@/lib/string-parser';

// Example schema for validation
const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
});

interface StringParserExampleProps {
  jsonData: string;
  csvData: string;
  urlParams: string;
  numberString: string;
  booleanString: string;
  dateString: string;
}

export default function StringParserExample({
  jsonData,
  csvData,
  urlParams,
  numberString,
  booleanString,
  dateString
}: StringParserExampleProps) {
  const [parsedData, setParsedData] = useState<any>({});

  useEffect(() => {
    // Parse JSON with schema validation
    const user = parseJsonString(jsonData, UserSchema);
    
    // Parse CSV
    const csvItems = parseCSV(csvData);
    
    // Parse URL parameters
    const params = parseUrlParams(urlParams);
    
    // Parse number
    const number = parseNumberString(numberString);
    
    // Parse boolean
    const boolean = parseBooleanString(booleanString);
    
    // Parse date
    const date = parseDateString(dateString);

    setParsedData({
      user,
      csvItems,
      params,
      number,
      boolean,
      date
    });
  }, [jsonData, csvData, urlParams, numberString, booleanString, dateString]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Parsed Data:</h2>
      
      <div className="space-y-2">
        <h3 className="font-semibold">User (JSON):</h3>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(parsedData.user, null, 2)}
        </pre>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">CSV Items:</h3>
        <ul className="list-disc list-inside">
          {parsedData.csvItems?.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">URL Parameters:</h3>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(parsedData.params, null, 2)}
        </pre>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Number: {parsedData.number}</h3>
        <h3 className="font-semibold">Boolean: {parsedData.boolean?.toString()}</h3>
        <h3 className="font-semibold">Date: {parsedData.date?.toLocaleDateString()}</h3>
      </div>
    </div>
  );
} 