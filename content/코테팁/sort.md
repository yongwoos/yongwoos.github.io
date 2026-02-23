---
title: sort
---
```python
sorted_list = sorted(unsorted_list) # sorted() 함수는 주어진 리스트를 정렬하여 새로운 리스트를 반환합니다. 원본 리스트는 변경되지 않습니다.

unsorted_list.sort() # sort() 메서드는 리스트 자체를 정렬합니다. 원본 리스트가 변경됩니다. 기본값은 오름차순이며, 내림차순으로 정렬하려면 sort(reverse=True) 또는 sorted(unsorted_list, reverse=True)를 사용할 수 있습니다.

# 예시
unsorted_list = [5, 2, 9, 1, 5, 6]
sorted_list = sorted(unsorted_list) # sorted_list는 [1, 2, 5, 5, 6, 9]가 됩니다. unsorted_list는 여전히 [5, 2, 9, 1, 5, 6]입니다.
unsorted_list.sort() # unsorted_list는 이제 [1, 2, 5, 5, 6, 9]로 변경됩니다.

# lambda 함수 사용
unsorted_list = ['apple', 'banana', 'cherry']
sorted_list = sorted(unsorted_list, key=lambda x: len(x)) # 문자열의 길이를 기준으로 정렬합니다. sorted_list는 ['apple', 'banana', 'cherry]가 됩니다.

unsorted_list.sort(key=lambda x: len(x)) # unsorted_list는 이제 ['apple', 'banana', 'cherry]로 변경됩니다.

# 정렬 기준을 지정하는 key 매개변수
unsorted_list = ['apple', 'banana', 'cherry']
sorted_list = sorted(unsorted_list, key=lambda x: x[0]) # 문자열의 첫 글자를 기준으로 정렬합니다. sorted_list는 ['apple', 'banana', 'cherry']가 됩니다.
unsorted_list.sort(key=lambda x: x[0]) # unsorted_list는 이제 ['apple', 'banana', 'cherry']로 변경됩니다.

# lambda 함수 내림차순 정렬
unsorted_list = ['apple', 'banana', 'cherry']
sorted_list = sorted(unsorted_list, key=lambda x: len(x), reverse=True) # 문자열의 길이를 기준으로 내림차순 정렬합니다. sorted_list는 ['banana', 'cherry', 'apple']가 됩니다.
unsorted_list.sort(key=lambda x: len(x), reverse=True) # unsorted_list는 이제 ['banana', 'cherry', 'apple']로 변경됩니다.

# 또는
sorted_list = sorted(unsorted_list, key=lambda x: -len(x)) # 문자열의 길이를 기준으로 내림차순 정렬합니다. sorted_list는 ['banana', 'cherry', 'apple']가 됩니다.
unsorted_list.sort(key=lambda x: -len(x)) # unsorted_list는 이제 ['banana', 'cherry', 'apple']로 변경됩니다.
```