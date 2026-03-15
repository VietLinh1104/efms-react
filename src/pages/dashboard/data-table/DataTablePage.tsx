// @pages/dashboard/HomePage.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ButtonSpin } from "@components/common/ButtonSpin";
import { DataTable } from "@/components/ui/data-table";
import { columns, type Transaction } from "./columns";
import { Button } from "@/components/ui/button";
import React from "react";

const DataTablePage: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const data: Transaction[] = [
        {
            "id": "ef1ecb54-2122-40d3-bb4c-c64b59187d1e",
            "processId": 2251799813695331,
            "processStatus": "EMP_SUBMITED",
            "createdBy": "Viet Linh",
            "referenceNo": "432",
            "documentNo": "2314",
            "createdAt": "2026-02-09T02:07:37.219",
            "updatedAt": "2026-02-09T09:08:49.596337",
            "transactionType": "EXP",
            "description": "rtrwetret",
            "documentDate": "2026-02-09",
            "accountingPeriod": "2026-02-09"
        },
        {
            "id": "e7247c5e-f6e9-4113-8cc1-40ce4630f0bc",
            "processId": 2251799813691183,
            "processStatus": "ACC_APPROVED",
            "createdBy": "Viet Linh",
            "referenceNo": "1C25TTU",
            "documentNo": "300",
            "createdAt": "2026-02-07T16:53:14.006",
            "updatedAt": "2026-02-09T09:02:33.40487",
            "transactionType": "EXP",
            "description": "vczxvxzv",
            "documentDate": "2025-03-05",
            "accountingPeriod": "2025-03-05"
        },
        {
            "id": "05c38196-8ecc-422b-a7b9-9f3e7ee1fdef",
            "processId": 2251799813688232,
            "processStatus": "RD_ACCEPTED",
            "createdBy": "Viet Linh",
            "referenceNo": "1C25TTU",
            "documentNo": "300",
            "createdAt": "2026-02-01T17:37:34.668",
            "updatedAt": "2026-02-07T23:52:19.526532",
            "transactionType": "EXP",
            "description": "",
            "documentDate": "2025-03-05",
            "accountingPeriod": "2025-03-05"
        },
        {
            "id": "3cbde497-8514-4a7b-b8d4-334309f53b28",
            "processId": 2251799813687670,
            "processStatus": "RD_ACCEPTED",
            "createdBy": "Nguyen Van A",
            "referenceNo": "1C25TTU",
            "documentNo": "300",
            "createdAt": "2026-02-01T08:38:15.979",
            "updatedAt": "2026-02-06T23:58:20.199777",
            "transactionType": "INC",
            "description": "Hóa đơn",
            "documentDate": "2025-03-05",
            "accountingPeriod": "2025-03-05"
        },
        {
            "id": "b4acaff9-493f-4eeb-a21a-59eca822aa07",
            "processId": 2251799813686029,
            "processStatus": "RD_ACCEPTED",
            "createdBy": "Nguyen Van A",
            "referenceNo": "ấdfsa",
            "documentNo": "fdsafs",
            "createdAt": "2026-01-31T14:16:31.773",
            "updatedAt": "2026-02-01T22:44:09.584457",
            "transactionType": "EXP",
            "description": "giao dịch bán hàng",
            "documentDate": "2026-01-31",
            "accountingPeriod": "2026-01-31"
        },
        {
            "id": "af2cf0f2-f875-4a3d-9b81-2a039dea719a",
            "processId": 2251799813685992,
            "processStatus": "RD_ACCEPTED",
            "createdBy": "Viet Linh",
            "referenceNo": "34214",
            "documentNo": "321421",
            "createdAt": "2026-01-31T14:16:01.587",
            "updatedAt": "2026-02-01T15:38:07.223521",
            "transactionType": "EXP",
            "description": "fadsafff",
            "documentDate": "2026-01-31",
            "accountingPeriod": "2026-01-31"
        },
        {
            "id": "1a197b4d-bee1-4c57-a3aa-d1b0c0ffd195",
            "processId": 2251799813685885,
            "processStatus": "RD_ACCEPTED",
            "createdBy": "Viet Linh",
            "referenceNo": "5432",
            "documentNo": "5423",
            "createdAt": "2026-01-31T14:08:02.227",
            "updatedAt": "2026-01-31T21:11:53.46365",
            "transactionType": "EXP",
            "description": "fdasf",
            "documentDate": "2026-01-31",
            "accountingPeriod": "2026-01-31"
        },
        {
            "id": "aacf5ed0-3363-4376-bfb0-0fc6d0699065",
            "processId": 2251799813685366,
            "processStatus": "EMP_CREATED",
            "createdBy": "Viet Linh",
            "referenceNo": "342",
            "documentNo": "5234",
            "createdAt": "2026-01-31T12:56:00.857",
            "updatedAt": "2026-01-31T20:57:00.898921",
            "transactionType": "EXP",
            "description": "",
            "documentDate": "2026-01-29",
            "accountingPeriod": "2026-01-29"
        },
        {
            "id": "6d134c4a-eab5-4c9d-9a24-f6d258817160",
            "processId": 2251799813808185,
            "processStatus": "ACC_APPROVED",
            "createdBy": "Viet Linh",
            "referenceNo": "1432",
            "documentNo": "34214",
            "createdAt": "2026-01-27T16:53:15.762",
            "updatedAt": "2026-01-27T23:58:17.293455",
            "transactionType": "EXP",
            "description": "dfsaf",
            "documentDate": "2026-01-27",
            "accountingPeriod": "2026-01-27"
        },
        {
            "id": "beffba81-409b-454e-a73f-68bfa766ad0d",
            "processId": 2251799813808128,
            "processStatus": "EMP_CREATED",
            "createdBy": "Viet Linh",
            "referenceNo": "523",
            "documentNo": "54325",
            "createdAt": "2026-01-27T16:51:34.806",
            "updatedAt": "2026-01-27T23:51:39.687398",
            "transactionType": "EXP",
            "description": "dfsafdsaf",
            "documentDate": "2026-01-27",
            "accountingPeriod": "2026-01-27"
        },
        {
            "id": "3048d8aa-232e-4df1-b470-58b790a310c1",
            "processId": 2251799813808094,
            "processStatus": "EMP_CREATED",
            "createdBy": "Viet Linh",
            "referenceNo": "4523",
            "documentNo": "4235243",
            "createdAt": "2026-01-27T16:51:17.619",
            "updatedAt": "2026-01-27T23:51:29.818708",
            "transactionType": "INC",
            "description": "sadfdsaf",
            "documentDate": "2026-01-27",
            "accountingPeriod": "2026-01-27"
        },
        {
            "id": "fd0caa48-8c43-493e-b211-12e935d253b3",
            "processId": 2251799813808059,
            "processStatus": "ACC_APPROVED",
            "createdBy": "Viet Linh",
            "referenceNo": "421",
            "documentNo": "421",
            "createdAt": "2026-01-27T16:51:01.741",
            "updatedAt": "2026-01-27T23:57:59.452174",
            "transactionType": "EXP",
            "description": "fdsafsda",
            "documentDate": "2026-01-27",
            "accountingPeriod": "2026-01-27"
        },
        {
            "id": "8ac30af2-f026-4f11-b791-ac03cedb95e4",
            "processId": 2251799813808023,
            "processStatus": "ACC_APPROVED",
            "createdBy": "Viet Linh",
            "referenceNo": "23432",
            "documentNo": "4324",
            "createdAt": "2026-01-27T16:50:19.025",
            "updatedAt": "2026-01-27T23:55:52.071754",
            "transactionType": "EXP",
            "description": "tessttt",
            "documentDate": "2026-01-27",
            "accountingPeriod": "2026-01-27"
        },
        {
            "id": "a72713ce-b8b6-42c6-8c08-57bf3f070738",
            "processId": 2251799813807886,
            "processStatus": "RD_ACCEPTED",
            "createdBy": "Viet Linh",
            "referenceNo": "342",
            "documentNo": "3241",
            "createdAt": "2026-01-26T18:25:47.02",
            "updatedAt": "2026-01-27T01:29:05.906283",
            "transactionType": "EXP",
            "description": "Newwww",
            "documentDate": "2026-01-26",
            "accountingPeriod": "2026-01-26"
        },
        {
            "id": "1b13d711-7099-4a73-947e-0d71629ce120",
            "processId": 2251799813806779,
            "processStatus": "EMP_DRAFT",
            "createdBy": "Viet Linh",
            "referenceNo": "4352",
            "documentNo": "3424",
            "createdAt": "2026-01-24T16:04:02.862",
            "updatedAt": "2026-01-27T00:26:56.990982",
            "transactionType": "EXP",
            "description": "dfasaf",
            "documentDate": "2026-01-24",
            "accountingPeriod": "2026-01-24"
        },
        {
            "id": "b2a5e10a-147f-4f0f-833f-0f248bfb8fc8",
            "processId": 2251799813803489,
            "processStatus": "RD_ACCEPTED",
            "createdBy": "Viet Linh",
            "referenceNo": "324",
            "documentNo": "324",
            "createdAt": "2026-01-24T10:59:09.651",
            "updatedAt": "2026-01-27T01:30:06.671145",
            "transactionType": "EXP",
            "description": "dfadsf",
            "documentDate": "2026-01-24",
            "accountingPeriod": "2026-01-24"
        },
        {
            "id": "4aa0bdca-9af2-420d-98a2-4abdef5bf394",
            "processId": 2251799813786314,
            "processStatus": "EMP_DRAFT",
            "createdBy": "Viet Linh",
            "referenceNo": "123",
            "documentNo": "123",
            "createdAt": "2026-01-21T14:19:58.943",
            "updatedAt": "2026-01-24T16:07:07.508496",
            "transactionType": "INC",
            "description": "sadsa",
            "documentDate": "2026-01-21",
            "accountingPeriod": "2026-01-21"
        },
        {
            "id": "5d9964ae-c05e-4811-9dbe-5f5d6b86cdbf",
            "processId": 2251799813785138,
            "processStatus": "EMP_DRAFT",
            "createdBy": "Viet Linh",
            "referenceNo": "123",
            "documentNo": "123",
            "createdAt": "2026-01-21T14:19:58.943",
            "updatedAt": "2026-01-24T15:59:37.820151",
            "transactionType": "INC",
            "description": "sadsa",
            "documentDate": "2026-01-21",
            "accountingPeriod": "2026-01-21"
        },
        {
            "id": "1e07187e-b8c4-4941-ad9f-91bc6db31584",
            "processId": 2251799813769379,
            "processStatus": "EMP_DRAFT",
            "createdBy": "Viet Linh",
            "referenceNo": "123",
            "documentNo": "123",
            "createdAt": "2026-01-21T14:19:58.943",
            "updatedAt": "2026-01-24T13:50:17.617672",
            "transactionType": "INC",
            "description": "sadsa",
            "documentDate": "2026-01-21",
            "accountingPeriod": "2026-01-21"
        },
        {
            "id": "2e5b518a-5d28-465d-ab82-4c3b55d87f11",
            "processId": 2251799813767825,
            "processStatus": "EMP_DRAFT",
            "createdBy": "Viet Linh",
            "referenceNo": "123",
            "documentNo": "123",
            "createdAt": "2026-01-21T14:19:58.943",
            "updatedAt": "2026-01-24T13:40:09.786064",
            "transactionType": "INC",
            "description": "sadsa",
            "documentDate": "2026-01-21",
            "accountingPeriod": "2026-01-21"
        }
    ];

    React.useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, []);

    return (
        <>
            <Tabs defaultValue="work" className="w-full">
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="work">Work</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>
                    <Button>Create Transaction</Button>
                </div>
                <TabsContent value="work">
                    <DataTable columns={columns} data={data} isLoading={isLoading} />
                </TabsContent>
                <TabsContent value="history">
                    <DataTable columns={columns} data={data} isLoading={true} />
                </TabsContent>
            </Tabs>


        </>
    );
};

export default DataTablePage;