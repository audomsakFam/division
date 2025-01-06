-- CreateTable
CREATE TABLE "ImgAndVideoPreview" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(500) NOT NULL,
    "type" SMALLINT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImgAndVideoPreview_pkey" PRIMARY KEY ("id")
);
