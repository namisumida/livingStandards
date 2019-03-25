# Import libraries 

# Data
undernourished <- read.csv("Data files/Standards of living data - Undernourished.csv")
under5 <- read.csv("Data files/Standards of living data - Under 5 mortality.csv") 
sanitation <- read.csv("Data files/Standards of living data - Sanitation.csv") 
electricity <- read.csv("Data files/Standards of living data - Electricity.csv") 
lifeExpectancy <- read.csv("Data files/Standards of living data - Life expectancy.csv") 
healthExpenditure <- read.csv("Data files/Standards of living data - Health expenditure.csv") 
maternal <- read.csv("Data files/Standards of living data - Maternal mortality.csv") 
ldc <- read.csv("Data files/LDC_data - 2018.csv")
ldc <- ldc[c("ISO..3", "Status")]
ldc <- ldc[c(2:146),]

# Merged dataset with the latest metrics
countryList <- c(as.character(undernourished$Country.Code), as.character(under5$Country.Code), as.character(sanitation$Country.Code), as.character(electricity$Country.Code), as.character(lifeExpectancy$Country.Code), as.character(healthExpenditure$Country.Code), as.character(maternal$Country.Code))
countryList <- unique(as.character(countryList))
latest <- as.data.frame(countryList)
names(latest) <- "Country.Code"
latest <- merge(latest, undernourished[,c(1,2,ncol(undernourished))], by="Country.Code", all.x=TRUE)
latest <- merge(latest, under5[,c(2,ncol(under5))], by="Country.Code", all.x=TRUE)
latest <- merge(latest, sanitation[,c(2,ncol(sanitation))], by="Country.Code", all.x=TRUE)
latest <- merge(latest, electricity[,c(2,ncol(electricity))], by="Country.Code", all.x=TRUE)
latest <- merge(latest, lifeExpectancy[,c(2,ncol(lifeExpectancy))], by="Country.Code", all.x=TRUE)
latest <- merge(latest, healthExpenditure[,c(2,ncol(healthExpenditure))], by="Country.Code", all.x=TRUE)
latest <- merge(latest, maternal[,c(2,ncol(maternal))], by="Country.Code", all.x=TRUE)

ldc[which(!(ldc$ISO..3 %in% latest$Country.Code)),]
latest <- merge(latest, ldc, by.x = "Country.Code", by.y = "ISO..3", all.x=TRUE)
summary(ldc$Status)
summary(latest$Status)

names(latest) <- c('countryCode', 'countryName', "undernourished", "under5mortality", "sanitation", "electricity", "lifeExpectancy", "healthExpenditure", "maternalMortality", "LDC")
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
# Life expectancy
summary(lifeExpectancy)
merged <- merge(merged, lifeExpectancy[,c(2,5:ncol(lifeExpectancy))], by.x="countryCode", by.y="Country.Code", all.x = TRUE)
for (i in 86:ncol(merged)) { names(merged)[i] <- changeColName("lifeExpectancy", i)}
# Sanitation
merged <- merge(merged, sanitation[,c(2,5:ncol(sanitation))], by.x="countryCode", by.y="Country.Code", all.x = TRUE)
for (i in 143:ncol(merged)) { names(merged)[i] <- changeColName("sanitation", i)}
# Electricity
merged <- merge(merged, electricity[,c(2,5:ncol(electricity))], by.x="countryCode", by.y="Country.Code", all.x = TRUE)
for (i in 202:ncol(merged)) { names(merged)[i] <- changeColName("electricity", i)}
# Health expenditure
summary(healthExpenditure)
merged <- merge(merged, healthExpenditure[,c(2,5:ncol(healthExpenditure))], by.x="countryCode", by.y="Country.Code", all.x = TRUE)
for (i in 261:ncol(merged)) { names(merged)[i] <- changeColName("healthExpenditure", i)}
# Maternal
summary(maternal)
merged <- merge(merged, maternal[,c(2,5:ncol(maternal))], by.x="countryCode", by.y="Country.Code", all.x = TRUE)
for (i in 277:ncol(merged)) { names(merged)[i] <- changeColName("maternal", i)}
names(merged) # 264 x 216


# Remove some "countries"
merged_edited <- merged[-which(merged$countryName=="World" | merged$countryName=="Arab World" | merged$countryName=="Caribbean small states" | merged$countryName=="Central Europe and the Baltics" | merged$countryName=="East Asia & Pacific" | merged$countryName=="East Asia & Pacific (excluding high income)" | merged$countryName=="Euro area" |
                                merged$countryName=="Europe & Central Asia" | merged$countryName=="Europe & Central Asia (excluding high income)" | merged$countryName=="European Union" | merged$countryName=="Fragile and conflict affected situations" | merged$countryName=="Heavily indebted poor countries (HIPC)" | merged$countryName=="Latin America & Caribbean" |
                                merged$countryName=="Latin America & Caribbean (excluding high income)" | merged$countryName=="Least developed countries: UN classification" | merged$countryName=="Middle East & North Africa" | merged$countryName=="Middle East & North Africa (excluding high income)" | merged$countryName=="North America" | merged$countryName=="OECD members" |
                                merged$countryName=="Other small states" | merged$countryName=="Pacific island small states" | merged$countryName=="Small states" | merged$countryName=="South Asia" | merged$countryName=="Sub-Saharan Africa" | merged$countryName=="Sub-Saharan Africa (excluding high income)" | merged$countryName=="High income" | 
                                merged$countryName=="Low & middle income" | merged$countryName=="Low income" | merged$countryName=="Lower middle income" | merged$countryName=="Middle income" | merged$countryName=="Upper middle income" | merged$countryName=="Early-demographic dividend" | merged$countryName=="IBRD only" | merged$countryName=="IDA & IBRD total" | 
                                merged$countryName=="IDA total" | merged$countryName=="IDA blend" | merged$countryName=="IDA only" | merged$countryName=="Not classified" | merged$countryName=="Late-demographic dividend" | merged$countryName=="Northern Mariana Islands" | merged$countryName=="Pre-demographic dividend" | merged$countryName=="West Bank and Gaza" |
                                merged$countryName=="Post-demographic dividend" | merged$countryName=="East Asia & Pacific (IDA & IBRD countries)" | merged$countryName=="Europe & Central Asia (IDA & IBRD countries)" | merged$countryName=="Latin America & the Caribbean (IDA & IBRD countries)" | merged$countryName=="Middle East & North Africa (IDA & IBRD countries)" |
                                merged$countryName=="South Asia (IDA & IBRD)" | merged$countryName=="Sub-Saharan Africa (IDA & IBRD countries)" | merged$countryName=="American Samoa" | merged$countryName=="Channel Islands" | merged$countryName=="Cayman Islands" | merged$countryName=="Gibraltar"| merged$countryName=="Isle of Man" | merged$countryName=="St. Martin (French part)" |
                                merged$countryName=="New Caledonia" | merged$countryName=="Puerto Rico" | merged$countryName=="Sint Maarten (Dutch part)" | merged$countryName=="Turks and Caicos Islands" | merged$countryName=="British Virgin Islands" | merged$countryName=="Virgin Islands (U.S.)" | merged$countryName=="Kosovo"),]
merged_edited$countryName <- as.character(merged_edited$countryName)
merged_edited[which(merged_edited$countryName=="Bahamas, The"),]$countryName <- "The Bahamas"
merged_edited[which(merged_edited$countryName=="Congo, Dem. Rep."),]$countryName <- "DRC"
merged_edited[which(merged_edited$countryName=="Congo, Rep."),]$countryName <- "Republic of the Congo"
merged_edited[which(merged_edited$countryName=="Egypt, Arab Rep."),]$countryName <- "Egypt"
merged_edited[which(merged_edited$countryName=="Micronesia, Fed. Sts."),]$countryName <- "Micronesia"
merged_edited[which(merged_edited$countryName=="United Kingdom"),]$countryName <- "UK"
merged_edited[which(merged_edited$countryName=="Gambia, The"),]$countryName <- "Gambia"
merged_edited[which(merged_edited$countryName=="Hong Kong SAR, China"),]$countryName <- "Hong Kong"
merged_edited[which(merged_edited$countryName=="Iran, Islamic Rep."),]$countryName <- "Iran"
merged_edited[which(merged_edited$countryName=="Korea, Rep."),]$countryName <- "South Korea"
merged_edited[which(merged_edited$countryName=="Lao PDR"),]$countryName <- "Laos"
merged_edited[which(merged_edited$countryName=="Macao SAR, China"),]$countryName <- "Macau"
merged_edited[which(merged_edited$countryName=="Macedonia, FYR"),]$countryName <- "Macedonia"
merged_edited[which(merged_edited$countryName=="Korea, Dem. People’s Rep."),]$countryName <- "North Korea"
merged_edited[which(merged_edited$countryName=="Russian Federation"),]$countryName <- "Russia"
merged_edited[which(merged_edited$countryName=="Syrian Arab Republic"),]$countryName <- "Syria"
merged_edited[which(merged_edited$countryName=="Venezuela, RB"),]$countryName <- "Venezuela"
merged_edited[which(merged_edited$countryName=="United States"),]$countryName <- "USA"
merged_edited[which(merged_edited$countryName=="Yemen, Rep."),]$countryName <- "Yemen"

write.csv(merged, "Data files/merged_edited.csv", row.names = FALSE)


# Analysis
summary(latest) # world
summary(subset(latest, countryName=="United States"))
summary(subset(latest, LDC==1))

