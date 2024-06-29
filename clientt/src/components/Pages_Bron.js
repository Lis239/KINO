import React, {useContext} from 'react';
import {Context} from "../index";
import {Pagination} from "react-bootstrap";
import {observer} from "mobx-react-lite";

const PagesBron = observer(() => {
    const {bron} = useContext(Context)
    const pageCount = Math.ceil(bron.gettotalCount / bron.getLimit)
    const pages = []
    for (let i = 0; i < pageCount; i++) {
        pages.push(i + 1)
    }
    return (
        <Pagination className="mt-3">
            {pages.map(page =>
                <Pagination.Item
                    key={page}
                    active={bron.page === page}
                    onClick={() => bron.setPage(page)}
                >
                    {page}
                </Pagination.Item>
            )}
        </Pagination>
    );
});

export default PagesBron;


