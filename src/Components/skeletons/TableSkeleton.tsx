import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export const TableSkeleton = ({ rows, columns }: { rows: number, columns: number }) => {
  return (
    <TableContainer
      sx={{ maxWidth: "90%", borderRadius: 2, border: `1px solid` }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton variant="rectangular" height={40} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton variant="rectangular" height={40} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

