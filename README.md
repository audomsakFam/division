## How to Start the Project

1. Make sure **Docker** is running on your machine.
2. Run the following command at the project root:

```bash
docker compose up --build
```

4. Run the following command at the project root:
   
   ```bash
    npm i
   ```
5. Prisma

    ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
 
6. 
   ```bash
    npm run dev
   ```
   
7. You can now visit http://localhost:3000/division-borrow to check the result.

