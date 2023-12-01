from lmqg import TransformersQG
import openpyxl
import json
import random

def convertToDaysOfWeek(row):
    # Rows 13-19 are days of the week: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
    # if they are empty, then skip them
    daysOfWeek = []
    if row[13].value is not None:
        daysOfWeek.append("Sunday")
    if row[14].value is not None:
        daysOfWeek.append("Monday")
    if row[15].value is not None:
        daysOfWeek.append("Tuesday")
    if row[16].value is not None:
        daysOfWeek.append("Wednesday")
    if row[17].value is not None:
        daysOfWeek.append("Thursday")
    if row[18].value is not None:
        daysOfWeek.append("Friday")
    if row[19].value is not None:
        daysOfWeek.append("Saturday")
    
    # return a string of the days of the week. If the course takes place on multiple days, then return a string of the days separated by commas and an "and" before the last day
    if len(daysOfWeek) == 1:
        return daysOfWeek[0]
    elif len(daysOfWeek) == 2:
        return daysOfWeek[0] + " and " + daysOfWeek[1]
    else:
        return ', '.join(daysOfWeek[:-1]) + ", and " + daysOfWeek[-1]
 
# Define variable to load the dataframe
dataframe = openpyxl.load_workbook('data/ECE GT Course Schedule.xlsx')

# Define variable to read sheet
dataframe1 = dataframe.active

courseDetailIntros = [
    "Can you give me course details about ",
    "What are the course details for ",
    "What are the details for ",
    "What are the details of ",
    "Tell me about ",
    "Give me details about ",
    "I'm looking for details about ",
    "I'm curious about ",
    'I want to know about ',
    'I want to learn about ',
]

def getQuestionsOfCourseSchedule():
 
    # Iterate the loop to read the cell values
    for row in dataframe1.iter_rows(min_row=1, min_col=1, max_row=1426, max_col=23):
        # for cell in row:
        intro = random.choice(courseDetailIntros)
        question = intro + str(row[2].value) + ' ' + str(row[3].value) + " Section " + str(row[4].value) + "?"
        answer = str(row[2].value) + ' ' + str(row[3].value) + " Section " + str(row[4].value) + " is offered in the " + str(row[0].value) + " semester. "

        # if one of the rows 13-19 is not empty and row 11 and 12 are not empty, 
        if (row[13].value is not None or
            row[14].value is not None or
            row[15].value is not None or
            row[16].value is not None or
            row[17].value is not None or
            row[18].value is not None or
            row[19].value is not None) and row[11].value is not None and row[12].value is not None:
            answer += "The course takes place on " + convertToDaysOfWeek(row) + " from " + str(row[11].value) + " to " + str(row[12].value)
            
        if row[20].value is not None and row[21].value is not None:
            answer += " in " + str(row[21].value) + ' Room ' + str(row[20].value) + "."
        else:
            answer += "."
            
        answer += " The CRN is " + str(row[1].value) + "."
        # Convert into format: "<s>[INST] question [/INST] answer </s>"
        formatted_answer = "<s>[INST] " + question + " [/INST] " + answer + " </s>"

        # Write to json file with attribute: "text": formatted_answer
        with open('synthetic-data/questions.json', 'a') as f:
            # Add to an array of questions
            json.dump({"text": formatted_answer}, f)
            f.write('\n')


threadIntros = [
    "Can you give me details about ",
    "What are the details for ",
    "What are the details of ",
    "Tell me about ",
    "Give me information about ",
    "I'm looking for details about ",
]

def getQuestionsFromThreads():
    with open('data/undergrad/degree-info/threads/threads.json') as f:
        data = json.load(f)

        # for each major, get the threads
        for major in data:
            threads = data[major]['threads']
            for thread in threads:
                # for each thread, get the title and description
                name = thread['name']
                if 'info' in thread:
                    info = thread['info']
                else:
                    info = None

                # create a question from the title
                intro = random.choice(threadIntros)
                question = intro + ' the ' + name + ' thread?'
                if (info is not None):
                    answer = 'Here is some information about the ' + name + ' thread: ' + info
                else:
                    answer = 'There is no information about the ' + name + ' thread.'
                
                # Convert into format: "<s>[INST] question [/INST] answer </s>"
                formatted_answer = "<s>[INST] " + question + " [/INST] " + answer + " </s>"


                # Write to json file with attribute: "text": formatted_answer
                with open('synthetic-data/questions.json', 'a') as f:
                    # Add to an array of questions
                    json.dump({"text": formatted_answer}, f)
                    f.write('\n')

careerPathIntros = [
    'What are the career paths for ',
    'What are the career options for ',
    'What are the career opportunities for ',
    'What are the job opportunities for ',
    'What are the jobs for ',
    'What jobs can I find with ',
    'What jobs can I get with ',
]

def getCareerPathsFromThreads():
    with open('data/undergrad/degree-info/threads/threads.json') as f:
        data = json.load(f)

        # for each major, get the threads
        for major in data:
            threads = data[major]['threads']
            for thread in threads:
                # for each thread, get the title and description
                name = thread['name']
                if 'potentialCareerPaths' in thread:
                    careers = thread['potentialCareerPaths']
                else:
                    careers = None

                # turn the careers list into a sentence separated by commas and an "and" before the last career
                careersList = []
                if careers is not None:
                    for career in careers:
                        careersList.append(career)
                    if len(careersList) == 1:
                        careersSentence = careersList[0]
                    elif len(careersList) == 2:
                        careersSentence = careersList[0] + " and " + careersList[1]
                    else:
                        careersSentence = ', '.join(careersList[:-1]) + ", and " + careersList[-1]
                else:
                    careersSentence = None

                # create a question from the title
                intro = random.choice(threadIntros)
                question = intro + 'the ' + name + ' thread?'
                if (careers is not None):
                    answer = 'If you choose the ' + name + ' thread, common career paths include jobs in the following industries and at the following companies: ' + careersSentence
                else:
                    answer = 'There is no information about career paths for the ' + name + ' thread.'
                
                # Convert into format: "<s>[INST] question [/INST] answer </s>"
                formatted_answer = "<s>[INST] " + question + " [/INST] " + answer + " </s>"

                # Write to json file with attribute: "text": formatted_answer
                with open('synthetic-data/questions.json', 'a') as f:
                    # Add to an array of questions
                    json.dump({"text": formatted_answer}, f)
                    f.write('\n')

requiredCoursesIntros = [
    'What are the required courses for ',
    'What are the courses required for ',
    'What courses are required for ',
    'What classes are required for ',
    'What are the classes required for ',
    'What are the courses I need to take for ',
]

def getRequiredCoursesFromThreads():
    with open('data/undergrad/degree-info/threads/threads.json') as f:
        data = json.load(f)

        # for each major, get the threads
        for major in data:
            threads = data[major]['threads']
            for thread in threads:
                # for each thread, get the title and description
                name = thread['name']
                if 'requiredCourses' in thread:
                    requiredCourses = thread['requiredCourses']
                else:
                    requiredCourses = None

                # turn the requiredCourses list into a sentence separated by commas and an "and" before the last course
                requiredCoursesList = []
                if requiredCourses is not None:
                    for course in requiredCourses:
                        if 'name' not in course:
                            requiredCoursesList.append(course['cc'])
                        else:
                            requiredCoursesList.append(course['cc'] + ' (' + course['name'] + ')')
                    if len(requiredCoursesList) == 1:
                        requiredCoursesSentence = requiredCoursesList[0]
                    elif len(requiredCoursesList) == 2:
                        requiredCoursesSentence = requiredCoursesList[0] + " and " + requiredCoursesList[1]
                    else:
                        requiredCoursesSentence = ', '.join(requiredCoursesList[:-1]) + ", and " + requiredCoursesList[-1]
                else:
                    requiredCoursesSentence = None

                # create a question from the title
                intro = random.choice(requiredCoursesIntros)
                question = intro + 'the ' + name + ' thread?'
                if (requiredCourses is not None):
                    answer = 'If you choose the ' + name + ' thread, you will be required to take the following course(s): ' + requiredCoursesSentence
                else:
                    answer = 'There are no required courses for the ' + name + ' thread.'
                
                # Convert into format: "<s>[INST] question [/INST] answer </s>"
                formatted_answer = "<s>[INST] " + question + " [/INST] " + answer + " </s>"

                print(formatted_answer)

                # Write to json file with attribute: "text": formatted_answer
                with open('synthetic-data/questions.json', 'a') as f:
                    # Add to an array of questions
                    json.dump({"text": formatted_answer}, f)
                    f.write('\n')


def getThreadSpecificIntros(thread):

    threadSpecificTopicIntros = [
        'I am thinking of choosing the ' + thread + ' thread. What are the thread-specific topics for this thread?',
        'I am thinking of choosing the ' + thread + ' thread. What are the topics for this thread?',
        'I am thinking of choosing the ' + thread + ' thread. What are the electives for this thread?',
        'If I choose the ' + thread + ' thread, what are the thread-specific topics?',
        'I want to select the ' + thread + ' thread. What are the thread-specific topics?',
        'I want to select the ' + thread + ' thread. What are the topics?',
        'I want to select the ' + thread + ' thread. What are the electives?',
        'If I choose the ' + thread + ' thread, what are the topics?',
        'If I choose the ' + thread + ' thread, what are the electives?',
        'If I choose the ' + thread + ' thread, what are the thread-specific topics?',
        'If I choose the ' + thread + ' thread, what are the thread-specific topics?',
    ]

    return threadSpecificTopicIntros

def getThreadSpecificTopicsFromThreads():
    with open('data/undergrad/degree-info/threads/threads.json') as f:
        data = json.load(f)

        # for each major, get the threads
        for major in data:
            threads = data[major]['threads']
            for thread in threads:
                # for each thread, get the title and description
                name = thread['name']
                if 'threadSpecificTopics' in thread:
                    topics = thread['threadSpecificTopics']
                else:
                    topics = None
                topicsSentence = ''

                # turn the topics list into a sentence separated by commas and an "and" before the last topic
                topicsList = []
                if topics is not None:
                    for individualTopics in topics:
                        numberOfCoursesRequired = individualTopics['numberOfCoursesRequired']
                        for topic in individualTopics['courses']:
                            print(topic)
                            if ('name' not in topic):
                                course = topic['cc']
                            else:
                                course = topic['cc'] + ' (' + topic['name'] + ')'
                            topicsList.append(course)
                        if len(topicsList) == 1:
                            courseList = topicsList[0]
                        elif len(topicsList) == 2:
                            courseList = topicsList[0] + " and " + topicsList[1]
                        else:
                            courseList = ', '.join(topicsList[:-1]) + ", and " + topicsList[-1]
                            topicsSentence +=  str(numberOfCoursesRequired) + ' course from ' + courseList + '; '
                else:
                    topicsSentence = None

                # create a question from the title
                intro = random.choice(getThreadSpecificIntros(name))
                # question = intro + 'the ' + name + ' thread?'
                question = intro
                if (topics is not None):
                    answer = 'If you choose the ' + name + ' thread, you will take a selection of the following courses: ' + topicsSentence
                else:
                    answer = 'There are no topics for the ' + name + ' thread.'
                
                # Convert into format: "<s>[INST] question [/INST] answer </s>"
                formatted_answer = "<s>[INST] " + question + " [/INST] " + answer + " </s>"



                # Write to json file with attribute: "text": formatted_answer
                with open('synthetic-data/questions.json', 'a') as f:
                    # Add to an array of questions
                    json.dump({"text": formatted_answer}, f)
                    f.write('\n')

model = TransformersQG(language="en")
handbook = open('consolidated-data/graduate-handbook.txt')
data = handbook.read().splitlines()
size = len(data)
context = ""


for i in range(size):
  if len(context.split()) < 240:
      context += data[i] + " "
  else:
    question_answer = model.generate_qa(context)
    # for each qa pair, turn it into the format: "<s>[INST] question [/INST] answer </s>"
    formatted_answer = "<s>[INST] " + question_answer[0] + " [/INST] " + question_answer[1] + " </s>"
    
    # Write to json file with attribute: "text": formatted_answer
    with open('questions.json', 'a') as f:
        # Add to an array of questions. Do not overwrite the file, simply append to it.
        json.dump({"text": formatted_answer}, f)
        f.write('\n')
    
    context = ""

    