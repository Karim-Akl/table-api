import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';

interface Person {
  name: string;
  height: string;
  mass: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Person[];
}

const fetchPeopleData = async (url: string): Promise<Person[]> => {
  try {
    const response = await axios.get<ApiResponse>(url);
    return response.data.results.slice(0, 3); // Limit to the first 3 entries
  } catch (error) {
    console.error('Error fetching data', error);
    return [];
  }
};

const fetchAllPeopleData = async (): Promise<Person[]> => {
  let allPeople: Person[] = [];
  let nextUrl: string | null = 'https://swapi.dev/api/people/';

  while (nextUrl) {
    const people = await fetchPeopleData(nextUrl);
    allPeople = [...allPeople, ...people];
    nextUrl = (await axios.get<ApiResponse>(nextUrl)).data.next;
  }

  return allPeople;
};

const App = () => {
  const [data, setData] = React.useState<Person[]>([]);

  React.useEffect(() => {
    const loadData = async () => {
      const people = await fetchAllPeopleData();
      console.log('Fetched data:', people); // Add this line to check data
      setData(people);
    };
    loadData();
  }, []);

  return (
    <TableContainer component={Paper} style={{ width: '100%', height: '100vh',margin:"auto"}}>
      <Table style={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Height (cm)</TableCell>
            <TableCell align="right">Mass (kg)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((person, index) => (
            <TableRow key={index}>
              <TableCell>{person.name}</TableCell>
              <TableCell align="right">{person.height}</TableCell>
              <TableCell align="right">{person.mass}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default App;
