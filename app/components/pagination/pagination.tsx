import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}
const PaginationComponent = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const generatePageNumbers = () => {
        const pageNumbers = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            const startPage = Math.max(1, currentPage - 1);
            const endPage = Math.min(totalPages, currentPage + 1);

            if (startPage > 1) {
                pageNumbers.push(1, '...');
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages) {
                pageNumbers.push('...', totalPages);
            }
        }
        return pageNumbers;
    };

    return (
        <Pagination>
            <PaginationContent className="w-full flex justify-center ">
                <PaginationItem className="flex justify-center items-center">
                    <button disabled={currentPage == 1} className={currentPage == 1 ? "pointer-events-none opacity-50" : "hover:border-solid hover:border-2 p-2 rounded-full"} onClick={() => onPageChange(1)}><FaAnglesLeft /></button>

                    <PaginationPrevious onClick={() => onPageChange(currentPage - 1)}
                        aria-disabled={currentPage <= 1}
                        className={
                            currentPage == 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                        }
                    />
                </PaginationItem>
                {generatePageNumbers().map((page, index) =>
                    page == '...' ? (
                        <PaginationItem key={index} >
                            <button disabled>...</button>
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={index}>
                            <PaginationLink className="cursor-pointer" onClick={() => onPageChange(Number(page))} isActive={page == currentPage}>
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}
                <PaginationItem className="flex justify-center items-center">
                    <PaginationNext onClick={() => onPageChange(currentPage + 1)}
                        aria-disabled={currentPage == totalPages}
                        className={
                            currentPage == totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                        }
                    />
                    <button disabled={currentPage == totalPages} className={currentPage == totalPages ? "pointer-events-none opacity-50" : "hover:border-solid hover:border-2 p-2 rounded-full"} onClick={() => onPageChange(totalPages)}><FaAnglesRight /></button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationComponent;