## How to Start the Project

1. Make sure **Docker** is running on your machine.
2. Run the following command at the project root:

```bash
docker compose up --build -d
```

4. Run the following command at the project root:
   
   ```bash
    npm i
   ```
   
5. Prisma

    ```bash
   npx prisma migrate dev --name init
      ```
    ```bash
   npx prisma generate
    ```
    ```bash
   npx prisma db seed
    ```
 
6. Local Run
   ```bash
    npm run dev
   ```
   
7. Run express SSE
   ```bash
    npm run serve
   ```
   
8. You can now visit http://localhost:3000/division-borrow to check the result and http://localhost:3000/division-borrow/pages/admin/login to check dashboard (user: admin67891, password: 1234)

