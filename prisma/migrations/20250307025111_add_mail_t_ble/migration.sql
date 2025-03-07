-- CreateTable
CREATE TABLE "mailNoti" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mailNoti_pkey" PRIMARY KEY ("id")
);
