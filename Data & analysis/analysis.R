# Import libraries 

# Data
undernourished <- read.csv("Data files/Standards of living data - Undernourished.csv")
under5 <- read.csv("Data files/Standards of living data - Under 5 mortality.csv") 
sanitation_urban <- read.csv("Data files/Standards of living data - Sanitation (urban).csv") 
sanitation_rural <- read.csv("Data files/Standards of living data - Sanitation (rural).csv") 
lifeExpectancy <- read.csv("Data files/Standards of living data - Life expectancy.csv") 
healthExpenditure <- read.csv("Data files/Standards of living data - Health expenditure.csv") 
maternal <- read.csv("Data files/Standards of living data - Maternal mortality.csv") 
ldc <- read.csv("Data files/LDC_data - 2018.csv")
ldc <- ldc[c("ISO..3", "Status")]
ldc <- ldc[c(2:146),]

# Merged dataset with the latest metrics
countryList <- c(as.character(undernourished$Country.Code), as.character(under5$Country.Code), as.character(sanitation_rural$Country.Code), as.character(sanitation_urban$Country.Code), as.character(lifeExpectancy$Country.Code), as.character(healthExpenditure$Country.Code), as.character(maternal$Country.Code))
countryList <- unique(as.character(countryList))
latest <- as.data.frame(countryList)
names(latest) <- "Country.Code"
latest <- merge(latest, undernourished[,c(1,2,ncol(undernourished))], by="Country.Code", all.x=TRUE)
latest <- merge(latest, under5[,c(2,ncol(under5))], by="Country.Code", all.x=TRUE)
latest <- merge(latest, sanitation_urban[,c(2,ncol(sanitation_urban))], by="Country.Code", all.x=TRUE)
latest <- merge(latest, sanitation_rural[,c(2,ncol(sanitation_rural))], by="Country.Code", all.x=TRUE)
latest <- merge(latest, lifeExpectancy[,c(2,ncol(lifeExpectancy))], by="Country.Code", all.x=TRUE)
latest <- merge(latest, healthExpenditure[,c(2,ncol(healthExpenditure))], by="Country.Code", all.x=TRUE)
latest <- merge(latest, maternal[,c(2,ncol(maternal))], by="Country.Code", all.x=TRUE)

ldc[which(!(ldc$ISO..3 %in% latest$Country.Code)),]
latest <- merge(latest, ldc, by.x = "Country.Code", by.y = "ISO..3", all.x=TRUE)
summary(ldc$Status)
summary(latest$Status)

names(latest) <- c('countryCode', 'countryName', "undernourished", "under5mortality", "sanitationUrban", "sanitationRural", "lifeExpectancy", "healthExpenditure", "maternalMortality", "LDC")
latest$LDC <- ifelse(latest$LDC=="LDC", 1, 0)
latest[which(is.na(latest$LDC)),]$LDC <- 0 # many are NA
table(latest$LDC)


# Merged dataset with latest + all metric years
changeColName <- function(variable, index) {
  return(paste(variable, gsub("X", "", names(merged)[index]), sep=""))
}
# Undernourished
merged <- merge(latest, undernourished[,c(2,5:ncol(undernourished))], by.x="countryCode", by.y="Country.Code", all.x = TRUE)
for (i in 11:ncol(merged)) { names(merged)[i] <- changeColName("undernourished", i)}
# Under 5
summary(under5)
merged <- merge(merged, under5[,c(2,5:ncol(under5))], by.x="countryCode", by.y="Country.Code", all.x = TRUE)
for (i in 28:ncol(merged)) { names(merged)[i] <- changeColName("under5_", i)}
# Sanitation urban
summary(sanitation_urban)
merged <- merge(merged, sanitation_urban[,c(2,5:ncol(sanitation_urban))], by.x="countryCode", by.y="Country.Code", all.x = TRUE)
for (i in 86:ncol(merged)) { names(merged)[i] <- changeColName("sanitationUrban", i)}
# Sanitation rural
summary(sanitation_rural)
merged <- merge(merged, sanitation_rural[,c(2,5:ncol(sanitation_rural))], by.x="countryCode", by.y="Country.Code", all.x = TRUE)
for (i in 102:ncol(merged)) { names(merged)[i] <- changeColName("sanitationRural", i)}
# Life expectancy
summary(lifeExpectancy)
merged <- merge(merged, lifeExpectancy[,c(2,5:ncol(lifeExpectancy))], by.x="countryCode", by.y="Country.Code", all.x = TRUE)
for (i in 118:ncol(merged)) { names(merged)[i] <- changeColName("lifeExpectancy", i)}
# Health expenditure
summary(healthExpenditure)
merged <- merge(merged, healthExpenditure[,c(2,5:ncol(healthExpenditure))], by.x="countryCode", by.y="Country.Code", all.x = TRUE)
for (i in 175:ncol(merged)) { names(merged)[i] <- changeColName("healthExpenditure", i)}
# Maternal
summary(maternal)
merged <- merge(merged, maternal[,c(2,5:ncol(maternal))], by.x="countryCode", by.y="Country.Code", all.x = TRUE)
for (i in 191:ncol(merged)) { names(merged)[i] <- changeColName("maternal", i)}
names(merged) # 264 x 216


write.csv(merged, "Data files/merged.csv", row.names = FALSE)


# Analysis
summary(latest) # world
summary(subset(latest, countryName=="United States"))
summary(subset(latest, LDC==1))

